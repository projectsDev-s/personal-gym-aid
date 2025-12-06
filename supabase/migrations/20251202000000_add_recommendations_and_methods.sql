-- Add recommendations and training_methods columns to workout_plans table
ALTER TABLE public.workout_plans
ADD COLUMN recommendations TEXT,
ADD COLUMN training_methods TEXT;





