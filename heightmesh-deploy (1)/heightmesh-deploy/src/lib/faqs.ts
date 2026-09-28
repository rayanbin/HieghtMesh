// FAQ content for FAQPage schema

export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: 'How do I convert feet and inches to centimeters?',
    a: 'Multiply the feet by 30.48 and the inches by 2.54, then add the two results together. For example, 5 feet 11 inches equals (5 × 30.48) + (11 × 2.54) = 152.4 + 27.94 = 180.34 cm. This tool performs that conversion automatically.',
  },
  {
    q: 'How does the chart auto-scale when I add tall objects?',
    a: "The ruler's maximum value dynamically expands to match the tallest character on the chart. If you add a person at 180 cm, the ruler shows 0–200 cm. Add a giraffe (500 cm) and the ruler automatically re-scales to 0–550 cm with new grid step divisions. Add the Eiffel Tower (30,000 cm) and the ruler switches to meter units, showing 0–30,000 cm (300 m) with proportionally larger steps. All smaller figures automatically shrink proportionally so the comparison stays mathematically accurate.",
  },
  {
    q: 'What is the mid-parental height formula?',
    a: "The mid-parental height formula predicts a child's adult height based on the parents' heights. For a boy: (father's height + mother's height + 13) / 2. For a girl: (father's height + mother's height − 13) / 2. The result has a typical range of ±8.5 cm. The Child Potential Calculator uses this formula and adds the predicted height as a target bar on the chart.",
  },
  {
    q: 'What is the average human height?',
    a: "Global average adult height is roughly 171 cm (5'7\") for men and 159 cm (5'3\") for women, but it varies significantly by region. The Netherlands has among the tallest averages (around 183 cm for men), while parts of Southeast Asia and South America tend to be shorter.",
  },
  {
    q: 'Who is the tallest person ever recorded?',
    a: 'Robert Wadlow (1918–1940) of the United States remains the tallest medically verified human at 272 cm (8 ft 11.1 in). His height was caused by an overactive pituitary gland. The chart on this page scales automatically to accommodate him and even taller presets like the Eiffel Tower.',
  },
  {
    q: 'Can exercises really make you taller?',
    a: 'Genetics account for roughly 80% of your final adult height, and you cannot grow taller once your growth plates fuse (around age 18-21). However, stretching exercises, hanging, and posture correction can decompress your spine and improve posture, helping you reach your full genetic potential. Good posture alone can reclaim 2-4 cm of "lost" height that poor posture was hiding.',
  },
  {
    q: 'How often should I do height growth exercises?',
    a: 'For best results, perform the stretches daily or 4-5 times per week. Each session only takes 10-15 minutes. Consistency matters more than duration — 15 minutes every day is far more effective than 2 hours once a week. Pair with 8-10 hours of sleep for teens (when 70% of growth hormone is released) and a protein-rich diet.',
  },
  {
    q: 'Is my data saved or sent anywhere?',
    a: 'No. This height comparison tool runs entirely in your browser. The characters you add are stored only in memory on your device and are never transmitted to a server. Wikipedia search queries are sent directly to the Wikipedia REST API to fetch celebrity suggestions.',
  },
  {
    q: 'Is the child height calculator a medical diagnosis?',
    a: 'No. The Child Potential Height Calculator provides an estimate for educational purposes only. It is not a medical diagnosis. Genetics account for approximately 60-80% of final adult height, with nutrition, health, sleep, and environment contributing the remaining 20-40%. For concerns about your child\'s growth, consult a pediatrician or pediatric endocrinologist. Clinical assessment may involve growth charts, bone age X-rays, and hormone testing.',
  },
  {
    q: 'How does the lifestyle adjustment work in the calculator?',
    a: 'The calculator treats final height as 60% genetics and 40% lifestyle factors. The mid-parental formula gives the genetic midpoint. An optional lifestyle quiz (screen time, physical activity, diet quality) computes a 0-100 score that adjusts the target within the genetic range by ±1 to 4 cm. A high lifestyle score (good diet, regular exercise, low screen time) shifts the target upward; a low score shifts it downward. The adjustment is always clamped within the ±10 cm genetic range.',
  },
  {
    q: 'Is this height comparison tool really free? Are there any paid plans?',
    a: 'Yes, this tool is 100% free with no paid plans, subscriptions, signups, or credit card requirements. There are no hidden charges, premium tiers, or billing — every feature (visual comparison, child height calculator, growth exercises, celebrity search) is available at no cost. The tool is supported by lightweight contextual content, not user payments.',
  },
  {
    q: 'What is your refund and cancellation policy?',
    a: 'Not applicable. Because this tool is 100% free with no paid plans, subscriptions, or billing of any kind, there is nothing to cancel or refund. You can stop using the tool at any time without any obligation — no account to delete and no payment to recover.',
  },
  {
    q: 'Who is this height comparison tool designed for?',
    a: 'The tool is designed for four primary audiences: (1) General public who want to visually compare heights of people, celebrities, or everyday objects; (2) Parents who want to estimate their child\'s adult height using the clinically validated mid-parental formula; (3) Fitness enthusiasts and teens performing daily growth and posture exercises to maximize their genetic height potential; (4) Students, researchers, and developers needing a quick cm-to-ft/in unit converter with a visual reference.',
  },
];
