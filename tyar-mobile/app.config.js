export default ({ config }) => ({
  ...config,
  extra: {
    supabaseUrl: process.env.SUPABASE_URL || 'https://gfqafbubvdrpjgimtert.supabase.co',
    supabaseAnon: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    eas: { projectId: 'tyar-ev' },
  },
});
