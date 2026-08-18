-- Migration: Sincroniza leads existentes em etapas de perda e garante status de reativação
--
-- 1. Atualiza leads que estão em etapas do tipo 'lost' mas ficaram com lost_at nulo
-- 2. Define reactivation_status como 'pending' para entrarem na fila de reativação automática

DO $$
DECLARE
  v_default_reason_id uuid;
BEGIN
  -- Busca um motivo de perda padrão para associar aos leads que não possuem motivo
  SELECT id INTO v_default_reason_id
  FROM public.lost_reasons
  WHERE is_active = true
  ORDER BY position ASC
  LIMIT 1;

  -- Atualiza todos os leads que estão em etapas do tipo 'lost'
  UPDATE public.leads l
  SET 
    lost_at = COALESCE(l.lost_at, l.updated_at, now()),
    lost_reason_id = COALESCE(l.lost_reason_id, v_default_reason_id),
    reactivation_status = CASE 
      WHEN l.reactivation_status IS NULL OR l.reactivation_status = 'none' THEN 'pending'
      ELSE l.reactivation_status
    END
  FROM public.pipeline_stages s
  WHERE l.stage_id = s.id
    AND s.stage_type = 'lost'
    AND l.deleted_at IS NULL;

END $$;
