import { withSupabase } from "@supabase/server"

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase has RLS enabled scoped to the logged-in user
    const { data, error } = await ctx.supabase.from("clientes_fornecedores").select("*").limit(5)
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    return Response.json({
      success: true,
      data,
      message: "Olá da Edge Function OxCommerce utilizando o SDK @supabase/server!"
    })
  }),
}
