export const DISEASE_CATALOG = [
  {
    category: 'General & Infectious',
    diseases: [
      'Fever',
      'Influenza',
      'COVID-19',
      'Typhoid',
      'Viral Infection',
      'Routine Health Checkup',
    ],
  },
  {
    category: 'Cardiovascular',
    diseases: [
      'Hypertension',
      'Coronary Artery Disease',
      'Arrhythmia',
      'High Cholesterol',
    ],
  },
  {
    category: 'Respiratory',
    diseases: [
      'Asthma',
      'Bronchitis',
      'Pneumonia',
      'Allergic Rhinitis',
      'Sinusitis',
    ],
  },
  {
    category: 'Gastrointestinal',
    diseases: [
      'Acid Reflux (GERD)',
      'Gastritis',
      'Gastroenteritis',
      'Irritable Bowel Syndrome',
      'Constipation',
    ],
  },
  {
    category: 'Musculoskeletal & Neurological',
    diseases: [
      'Arthritis',
      'Lower Back Pain',
      'Migraine',
      'Tension Headache',
      'Muscle Strain',
    ],
  },
  {
    category: 'Endocrine & Metabolic',
    diseases: [
      'Type 2 Diabetes',
      'Hypothyroidism',
      'Hyperthyroidism',
      'Vitamin D Deficiency',
      'Anaemia',
    ],
  },
  {
    category: 'Dermatology',
    diseases: [
      'Eczema',
      'Psoriasis',
      'Fungal Infection',
      'Acne',
      'Urticaria',
    ],
  },
  {
    category: 'Mental Health',
    diseases: ['Anxiety Disorder', 'Depression', 'Insomnia', 'Stress Management'],
  },
]

export const DISEASES = DISEASE_CATALOG.flatMap((group) =>
  group.diseases.map((name) => ({ name, category: group.category })),
)

export const DOCTORS = [
  {
    id: 'doc-ananya-rao',
    name: 'Dr. Ananya Rao',
    specialization: 'Cardiology',
    degree: 'MBBS, MD (Cardiology)',
    experience: 14,
    hospital: 'Apollo Clinic, Bengaluru',
  },
  {
    id: 'doc-rohan-iyer',
    name: 'Dr. Rohan Iyer',
    specialization: 'Endocrinology',
    degree: 'MBBS, MD, DM (Endocrinology)',
    experience: 11,
    hospital: 'City Care Hospital, Pune',
  },
  {
    id: 'doc-meera-nair',
    name: 'Dr. Meera Nair',
    specialization: 'Pulmonology',
    degree: 'MBBS, MD (Pulmonary Medicine)',
    experience: 9,
    hospital: 'Green Valley Hospital, Kochi',
  },
  {
    id: 'doc-arjun-shah',
    name: 'Dr. Arjun Shah',
    specialization: 'General Medicine',
    degree: 'MBBS, MD (Internal Medicine)',
    experience: 16,
    hospital: 'Sunrise Multispeciality, Ahmedabad',
  },
  {
    id: 'doc-sana-khan',
    name: 'Dr. Sana Khan',
    specialization: 'Dermatology',
    degree: 'MBBS, MD (Dermatology)',
    experience: 8,
    hospital: 'Skin & Care Clinic, Hyderabad',
  },
  {
    id: 'doc-vikram-singh',
    name: 'Dr. Vikram Singh',
    specialization: 'Orthopaedics',
    degree: 'MBBS, MS (Orthopaedics)',
    experience: 18,
    hospital: 'Bone & Joint Institute, Delhi',
  },
  {
    id: 'doc-priya-menon',
    name: 'Dr. Priya Menon',
    specialization: 'Neurology',
    degree: 'MBBS, MD, DM (Neurology)',
    experience: 12,
    hospital: 'NeuroOne Centre, Chennai',
  },
  {
    id: 'doc-kabir-das',
    name: 'Dr. Kabir Das',
    specialization: 'Gastroenterology',
    degree: 'MBBS, MD, DM (Gastroenterology)',
    experience: 10,
    hospital: 'Digestive Health Clinic, Kolkata',
  },
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function findDisease(name) {
  return DISEASES.find((disease) => disease.name === name) ?? null
}

export function findDoctor(id) {
  return DOCTORS.find((doctor) => doctor.id === id) ?? null
}
