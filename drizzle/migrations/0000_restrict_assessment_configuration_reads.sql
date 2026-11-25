DROP POLICY IF EXISTS "public read" ON public.recommendation_rules;
REVOKE SELECT ON TABLE public.recommendation_rules FROM anon, authenticated;

DROP POLICY IF EXISTS "public read" ON public.scoring_profiles;
REVOKE SELECT ON TABLE public.scoring_profiles FROM anon, authenticated;

DROP POLICY IF EXISTS "public read" ON public.assessments;
REVOKE SELECT ON TABLE public.assessments FROM anon, authenticated;