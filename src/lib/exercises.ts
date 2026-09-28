// 10 height growth exercises — each with detailed step/benefit info for HowTo schema

export interface ExerciseStep {
  name: string;
  text: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Stretching' | 'Hanging' | 'Posture' | 'Strength';
  duration: number; // seconds
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles: string[];
  benefits: string;
  howTo: string;
  steps: ExerciseStep[];
  warnings?: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 'cobra-stretch',
    name: 'Cobra Stretch',
    category: 'Stretching',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Spine', 'Abdominals', 'Chest'],
    benefits: 'Decompresses the spine, opens the chest, and improves posture. Daily practice may help maximize your genetic height potential by improving spinal flexibility during growth years.',
    howTo: 'Lie face down, place hands under shoulders, slowly lift your chest off the floor while keeping hips grounded. Hold 30 seconds, breathing deeply.',
    steps: [
      { name: 'Position', text: 'Lie face down on a mat with legs extended and tops of feet on the floor. Place palms flat under your shoulders.' },
      { name: 'Lift', text: 'Slowly press through your hands to lift your chest and head, arching the spine backward. Keep your hips and pelvis pressed into the floor.' },
      { name: 'Hold', text: 'Hold the peak position for 30 seconds while breathing slowly and deeply. Focus on lengthening through the front of your torso.' },
      { name: 'Release', text: 'Slowly lower back down with control. Rest for 10 seconds, then repeat for 3 sets total.' },
    ],
    warnings: 'Avoid if you have lower back injuries. Stop immediately if you feel pinching in the lumbar spine.',
  },
  {
    id: 'bar-hanging',
    name: 'Bar Hanging',
    category: 'Hanging',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Spine', 'Shoulders', 'Grip'],
    benefits: 'Decompresses the spine by letting gravity stretch the vertebrae apart. May temporarily increase height by 1-2 cm and improves shoulder mobility with regular practice.',
    howTo: 'Grip an overhead bar shoulder-width apart, relax your body completely, and let your weight pull you down. Hang for 30 seconds.',
    steps: [
      { name: 'Grip', text: 'Stand under a pull-up bar. Reach up and grip the bar with palms facing away (overhand grip), hands shoulder-width apart.' },
      { name: 'Hang', text: 'Lift your feet off the ground and let your body hang completely relaxed. Keep your arms straight, shoulders away from your ears.' },
      { name: 'Breathe', text: 'Take slow, deep breaths for 30 seconds. Feel your spine lengthen as gravity decompresses the vertebrae.' },
      { name: 'Reset', text: 'Step down carefully. Rest 20 seconds, then repeat for 3 sets. Build up to 60-second hangs over time.' },
    ],
    warnings: 'Use a step to reach the bar — never jump up. Stop if you feel shoulder pain or dizziness.',
  },
  {
    id: 'pelvic-tilt',
    name: 'Pelvic Tilt',
    category: 'Posture',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Core', 'Lower back', 'Hip flexors'],
    benefits: 'Strengthens the deep core and corrects anterior pelvic tilt — a common posture issue that can make you appear 2-3 cm shorter than you actually are.',
    howTo: 'Lie on your back with knees bent, flatten your lower back against the floor by tilting your pelvis upward. Hold and release.',
    steps: [
      { name: 'Setup', text: 'Lie on your back with knees bent, feet flat on the floor hip-width apart, arms at your sides.' },
      { name: 'Tilt', text: 'Exhale and gently tilt your pelvis upward, pressing your lower back flat against the floor. Engage your lower abdominals.' },
      { name: 'Hold', text: 'Hold the tilt for 5 seconds while breathing normally. You should feel your deep core muscles working, not your glutes.' },
      { name: 'Repeat', text: 'Release slowly and repeat for 6-8 reps. Aim for 3 sets total, 30 seconds each set.' },
    ],
  },
  {
    id: 'forward-bend',
    name: 'Forward Bend',
    category: 'Stretching',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Hamstrings', 'Lower back', 'Spine'],
    benefits: 'Stretches the entire posterior chain — hamstrings, calves, and lower back. Releases tension in the spine and improves flexibility for better posture.',
    howTo: 'Stand tall, exhale and fold forward from the hips, reaching for your toes. Let your head and neck hang heavy.',
    steps: [
      { name: 'Stand', text: 'Stand with feet hip-width apart, knees slightly soft. Inhale and reach your arms overhead to lengthen your spine.' },
      { name: 'Fold', text: 'Exhale and hinge at the hips, folding forward. Let your hands drop toward your toes. Bend knees as much as needed.' },
      { name: 'Hang', text: 'Let your head and neck relax completely. Hold for 30 seconds, breathing slowly. Feel the stretch along your spine and hamstrings.' },
      { name: 'Rise', text: 'Slowly roll up one vertebra at a time to stand. Repeat 3 times.' },
    ],
    warnings: 'Keep knees slightly bent if you have tight hamstrings. Do not bounce — hold statically.',
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    category: 'Stretching',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Spine', 'Neck', 'Core'],
    benefits: 'Mobilizes the entire spine through flexion and extension. Improves spinal fluid circulation and relieves back tension that can compress your natural height.',
    howTo: 'On hands and knees, alternate between arching your back (cat) and dropping your belly (cow) in sync with your breath.',
    steps: [
      { name: 'Start', text: 'Begin on hands and knees in a tabletop position. Wrists under shoulders, knees under hips, spine neutral.' },
      { name: 'Cat', text: 'Exhale and round your spine toward the ceiling, tucking your chin and tailbone. Draw your belly button in.' },
      { name: 'Cow', text: 'Inhale and drop your belly toward the floor, lifting your chest and tailbone toward the ceiling. Lift your gaze gently.' },
      { name: 'Flow', text: 'Continue alternating cat and cow for 30 seconds, syncing each movement with your breath. Aim for 5-6 full cycles.' },
    ],
  },
  {
    id: 'pike-stretch',
    name: 'Pike Stretch',
    category: 'Stretching',
    duration: 30,
    difficulty: 'Intermediate',
    targetMuscles: ['Hamstrings', 'Calves', 'Lower back'],
    benefits: 'Deep stretch for the posterior chain. Lengthens the hamstrings and decompresses the lower spine — key for maintaining full height.',
    howTo: 'Sit with legs extended straight, reach forward toward your toes while keeping your back flat.',
    steps: [
      { name: 'Sit', text: 'Sit on the floor with both legs extended straight in front of you. Flex your feet toward your shins.' },
      { name: 'Reach', text: 'Inhale and lengthen your spine. Exhale and hinge forward from the hips, reaching your hands toward your toes.' },
      { name: 'Hold', text: 'Keep your back as flat as possible (avoid rounding). Hold 30 seconds, breathing into the stretch.' },
      { name: 'Release', text: 'Inhale and slowly sit back up. Repeat 3 times, going slightly deeper each round.' },
    ],
  },
  {
    id: 'wall-slide',
    name: 'Wall Slides',
    category: 'Posture',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Shoulders', 'Upper back', 'Core'],
    benefits: 'Corrects rounded shoulders and forward head posture — posture issues that can rob you of 2-4 cm of apparent height. Strengthens the postural muscles of the upper back.',
    howTo: 'Stand with back against a wall, slide arms up and down the wall while keeping contact.',
    steps: [
      { name: 'Setup', text: 'Stand with your back, head, and heels against a wall. Feet 10 cm from the wall. Arms out to sides, elbows bent at 90°, backs of hands touching the wall.' },
      { name: 'Slide up', text: 'Slowly slide your hands up the wall as high as you can, keeping your wrists, elbows, and shoulders in contact with the wall.' },
      { name: 'Slide down', text: 'Slowly slide back down to the starting position. Do not let your lower back arch away from the wall.' },
      { name: 'Repeat', text: 'Continue for 30 seconds. Aim for 8-10 reps per set, 3 sets total.' },
    ],
    warnings: 'If you cannot keep your hands on the wall, your shoulders are very tight — reduce range and progress gradually.',
  },
  {
    id: 'superman',
    name: 'Superman Hold',
    category: 'Strength',
    duration: 30,
    difficulty: 'Intermediate',
    targetMuscles: ['Lower back', 'Glutes', 'Shoulders'],
    benefits: 'Strengthens the entire posterior chain. A strong back supports an upright, tall posture that visually adds centimeters to your appearance.',
    howTo: 'Lie face down, simultaneously lift your arms, chest, and legs off the floor. Hold.',
    steps: [
      { name: 'Position', text: 'Lie face down on a mat with arms extended in front of you and legs straight behind you.' },
      { name: 'Lift', text: 'Simultaneously lift your arms, chest, and legs off the floor as high as comfortable. Squeeze your glutes and lower back.' },
      { name: 'Hold', text: 'Hold the peak position for 5-10 seconds. Keep your neck neutral — look at the floor, not up.' },
      { name: 'Lower', text: 'Slowly lower with control. Rest 5 seconds, repeat for 4-5 reps. Build to 30-second total holds.' },
    ],
  },
  {
    id: 'triangle-pose',
    name: 'Triangle Pose',
    category: 'Stretching',
    duration: 30,
    difficulty: 'Intermediate',
    targetMuscles: ['Spine', 'Hamstrings', 'Obliques'],
    benefits: 'Lateral spine stretch that opens the side body, improves balance, and decompresses the spine. Counteracts the compression from prolonged sitting.',
    howTo: 'Stand with feet wide apart, reach one hand down to your shin and the other up to the ceiling.',
    steps: [
      { name: 'Stance', text: 'Stand with feet about 1 meter apart. Turn your right foot out 90°, left foot slightly inward.' },
      { name: 'Reach', text: 'Extend your arms parallel to the floor. Reach your right hand forward, then hinge at the hip to lower your right hand to your shin or ankle.' },
      { name: 'Extend', text: 'Extend your left arm straight up toward the ceiling. Turn your head to look up at your top hand. Hold 30 seconds.' },
      { name: 'Switch', text: 'Inhale to rise. Repeat on the left side. Aim for 2 sets per side.' },
    ],
  },
  {
    id: 'child-pose',
    name: "Child's Pose",
    category: 'Stretching',
    duration: 30,
    difficulty: 'Beginner',
    targetMuscles: ['Spine', 'Hips', 'Shoulders'],
    benefits: 'Gentle decompression stretch for the entire spine. Releases lower back tension and stretches the hips — perfect as a cool-down after hanging exercises.',
    howTo: 'Kneel on the floor, sit back on your heels, and fold forward with arms extended.',
    steps: [
      { name: 'Kneel', text: 'Start on your hands and knees. Bring your big toes to touch and spread your knees as wide as comfortable.' },
      { name: 'Fold', text: 'Sit your hips back onto your heels. Fold your torso forward, resting your forehead on the floor.' },
      { name: 'Reach', text: 'Extend your arms forward along the floor, palms down. Alternatively, rest arms alongside your body, palms up.' },
      { name: 'Breathe', text: 'Hold for 30 seconds (or longer). Breathe slowly and deeply into your lower back. Feel your spine lengthen with each exhale.' },
    ],
  },
];
