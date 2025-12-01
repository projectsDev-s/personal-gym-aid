-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('M', 'F', 'Outro')),
  objective TEXT NOT NULL,
  weight DECIMAL(5,2),
  body_fat DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  bmi DECIMAL(5,2),
  restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now - will need authentication later)
CREATE POLICY "Allow all operations on students" 
ON public.students 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create workout_plans table
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  week_day1 TEXT,
  week_day2 TEXT,
  week_day3 TEXT,
  week_day4 TEXT,
  week_day5 TEXT,
  week1_reps TEXT,
  week1_rest TEXT,
  week2_reps TEXT,
  week2_rest TEXT,
  week3_reps TEXT,
  week3_rest TEXT,
  week4_reps TEXT,
  week4_rest TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on workout_plans" 
ON public.workout_plans 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create workout_days table
CREATE TABLE public.workout_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('orange', 'green', 'purple', 'red')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on workout_days" 
ON public.workout_days 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  cadence TEXT NOT NULL,
  methods TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on exercises" 
ON public.exercises 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
BEFORE UPDATE ON public.workout_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();