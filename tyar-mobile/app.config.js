export default ({ config }) => ({
  ...config,
  extra: {
    supabaseUrl: process.env.SUPABASE_URL || 'https://gfqafbubvdrpjgimtert.supabase.co',
    supabaseAnon: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    eas: { projectId: 'aa15a6b6-4a4d-4f37-a131-0f858d5ae284' },
  },
});
