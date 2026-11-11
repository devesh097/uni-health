function createSampleDocument({ id, title, doctor, date }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
    <rect width="900" height="1200" fill="#f8fafc"/>
    <rect x="0" y="0" width="900" height="150" fill="#065f46"/>
    <text x="60" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700">UniHealth Medical Centre</text>
    <text x="60" y="112" fill="#a7f3d0" font-family="Arial, sans-serif" font-size="20">Patient prescription record</text>
    <text x="60" y="220" fill="#0f172a" font-family="Arial, sans-serif" font-size="26" font-weight="700">${title}</text>
    <text x="60" y="264" fill="#475569" font-family="Arial, sans-serif" font-size="20">Doctor: ${doctor}</text>
    <text x="60" y="300" fill="#475569" font-family="Arial, sans-serif" font-size="20">Date: ${date}</text>
    <line x1="60" y1="340" x2="840" y2="340" stroke="#cbd5e1" stroke-width="2"/>
    <text x="60" y="400" fill="#334155" font-family="Arial, sans-serif" font-size="20">Rx</text>
    <text x="60" y="450" fill="#0f172a" font-family="Arial, sans-serif" font-size="22">1. Continue prescribed medication as directed.</text>
    <text x="60" y="492" fill="#0f172a" font-family="Arial, sans-serif" font-size="22">2. Maintain a symptom and vitals log daily.</text>
    <text x="60" y="534" fill="#0f172a" font-family="Arial, sans-serif" font-size="22">3. Return for review after four weeks.</text>
    <line x1="60" y1="1040" x2="840" y2="1040" stroke="#cbd5e1" stroke-width="2"/>
    <text x="60" y="1090" fill="#64748b" font-family="Arial, sans-serif" font-size="18">Digitally generated sample document for the UniHealth prototype.</text>
  </svg>`

  return {
    id,
    name: `${title.toLowerCase().replaceAll(' ', '-')}-scan.svg`,
    type: 'image/svg+xml',
    size: svg.length,
    dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    uploadedAt: '2026-11-02T09:55:00.000Z',
  }
}

export const SAMPLE_TREATMENTS = [
  {
    id: 'trt-sample-asthma',
    disease: 'Asthma',
    diseaseCategory: 'Respiratory',
    doctorId: 'doc-meera-nair',
    doctorName: 'Dr. Meera Nair',
    doctorSpecialization: 'Pulmonology',
    startTime: '2026-11-10T18:30:00.000Z',
    endTime: '2026-12-10T18:30:00.000Z',
    prescription:
      'Fluticasone/salmeterol inhaler, 2 puffs twice daily. Salbutamol rescue inhaler as needed. Avoid known triggers and continue peak-flow monitoring.',
    notes:
      'Patient reported mild night-time wheezing. Spirometry review scheduled at the next visit.',
    documents: [],
    createdAt: '2026-11-10T18:45:00.000Z',
    updatedAt: '2026-11-10T18:45:00.000Z',
  },
  {
    id: 'trt-sample-diabetes',
    disease: 'Type 2 Diabetes',
    diseaseCategory: 'Endocrine & Metabolic',
    doctorId: 'doc-rohan-iyer',
    doctorName: 'Dr. Rohan Iyer',
    doctorSpecialization: 'Endocrinology',
    startTime: '2026-11-02T09:00:00.000Z',
    endTime: '2026-11-02T09:45:00.000Z',
    prescription:
      'Metformin 500 mg twice daily after meals. Continue home glucose monitoring twice a week and follow a low-glycaemic diet.',
    notes:
      'HbA1c improved to 6.8%. No hypoglycaemic episodes reported since the last review.',
    documents: [
      createSampleDocument({
        id: 'doc-sample-diabetes',
        title: 'Diabetes Review',
        doctor: 'Dr. Rohan Iyer',
        date: '02 Nov 2026',
      }),
    ],
    createdAt: '2026-11-02T10:02:00.000Z',
    updatedAt: '2026-11-02T10:02:00.000Z',
  },
  {
    id: 'trt-sample-hypertension',
    disease: 'Hypertension',
    diseaseCategory: 'Cardiovascular',
    doctorId: 'doc-ananya-rao',
    doctorName: 'Dr. Ananya Rao',
    doctorSpecialization: 'Cardiology',
    startTime: '2026-10-14T10:30:00.000Z',
    endTime: '2026-10-14T11:15:00.000Z',
    prescription:
      'Telmisartan 40 mg once daily in the morning. Reduce added salt intake and record blood pressure every morning for two weeks.',
    notes:
      'Average clinic reading was 138/88 mmHg. Continue the current lifestyle plan.',
    documents: [
      createSampleDocument({
        id: 'doc-sample-hypertension',
        title: 'Cardiology Consultation',
        doctor: 'Dr. Ananya Rao',
        date: '14 Oct 2026',
      }),
    ],
    createdAt: '2026-10-14T11:30:00.000Z',
    updatedAt: '2026-10-14T11:30:00.000Z',
  },
]
