import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch user's recent transactions and profile
    const [transactionsResult, profileResult] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('profiles')
        .select('currency')
        .eq('user_id', userId)
        .single()
    ])

    if (transactionsResult.error) {
      throw new Error('Failed to fetch transactions')
    }

    if (profileResult.error) {
      throw new Error('Failed to fetch profile')
    }

    const transactions = transactionsResult.data
    const currency = profileResult.data.currency

    // Prepare data for AI analysis
    const transactionSummary = transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other'
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 }
      }
      acc[category].total += transaction.amount
      acc[category].count += 1
      return acc
    }, {})

    const totalSpent = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const prompt = `
Analyze the following financial data and provide 3 concise, actionable insights:

Currency: ${currency}
Total Income: ${totalIncome}
Total Expenses: ${totalSpent}
Net: ${totalIncome - totalSpent}

Spending by Category:
${Object.entries(transactionSummary)
  .map(([category, data]: [string, any]) => `${category}: ${data.total} (${data.count} transactions)`)
  .join('\n')}

Recent Transactions (last 10):
${transactions.slice(0, 10).map(t => `${t.description}: ${t.amount}`).join('\n')}

Provide insights in this exact JSON format:
{
  "insights": [
    {
      "title": "Brief insight title",
      "description": "Actionable advice in 1-2 sentences",
      "type": "spending|saving|investment|warning"
    }
  ]
}

Focus on practical, specific advice based on the spending patterns shown.`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor AI that provides concise, actionable insights based on spending data. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!openaiResponse.ok) {
      throw new Error('Failed to get AI insights')
    }

    const aiResult = await openaiResponse.json()
    const content = aiResult.choices[0].message.content

    let insights
    try {
      insights = JSON.parse(content)
    } catch {
      // Fallback if JSON parsing fails
      insights = {
        insights: [
          {
            title: "Spending Analysis",
            description: "Based on your recent transactions, consider reviewing your largest expense categories for optimization opportunities.",
            type: "spending"
          }
        ]
      }
    }

    return new Response(
      JSON.stringify(insights),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        insights: [
          {
            title: "Analysis Unavailable",
            description: "Unable to generate insights at this time. Please try again later.",
            type: "warning"
          }
        ]
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})