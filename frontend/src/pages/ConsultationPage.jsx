import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../api/client';
import { useSession } from '../context/SessionContext';
import PatientCharacter from '../components/PatientCharacter';


// ── Browser TTS — replaces ElevenLabs ──────────────────────────────────────
// speakPatientReply uses the built-in Web Speech API (works natively in Electron).
// stopSpeech cancels playback when navigating away.
import { speakPatientReply, stopSpeech, initVoices } from '../services/voiceService';
import VoiceRecorder from '../components/VoiceRecorder';

// All images served from /public/medical/ folder in the React project
const M = (dept, file) => `/medical/${dept}/${file}`;


const DEPT_EXAMS = {
  'General Medicine': [
    { name:'Abdomen Exam',      img: M('General Medicine','Abdomin.jpg'),      label:'Abdominal Examination',      desc:'Inspect and palpate all 9 quadrants. Note tenderness, guarding, rigidity or organomegaly.' },
    { name:'Chest Exam',        img: M('General Medicine','Patinet Chest'),     label:'Chest Examination',          desc:'Inspect chest wall shape and movement. Auscultate all zones for breath sounds.' },
    { name:'Sclera Check',      img: M('General Medicine','Sclera.jfif'),       label:'Scleral Icterus Assessment', desc:'Examine sclera for yellow discolouration indicating jaundice (bilirubin >2.5 mg/dL).' },
    { name:'Skin Exam',         img: M('General Medicine','Skin Rash.jfif'),    label:'Dermatological Examination', desc:'Inspect skin for rash, pallor, cyanosis, lesions or discolouration.' },
    { name:'Throat Exam',       img: M('General Medicine','Tonsils.webp'),      label:'Oropharynx Inspection',      desc:'Examine tonsils, posterior pharynx. Note erythema, exudate or tonsillar enlargement.' },
  ],
  'Dentistry': [
    { name:'Teeth & Gums',      img: M('Dentistry','Teeth and Gum.jpg'),        label:'Teeth & Gingival Inspection',  desc:'Inspect all tooth surfaces and gum margins. Note colour, contour and plaque.' },
    { name:'Decayed Tooth',     img: M('Dentistry','Decayed Tooth.webp'),                label:'Dental Caries — Cavity',       desc:'Active carious lesion visible. Assess depth: enamel, dentine or pulpal involvement.' },
    { name:'Gum Inflammation',  img: M('Dentistry','Gum Inflammation.jfif'),              label:'Gingival Inflammation',        desc:'Erythematous, swollen gingiva with bleeding on probing. Suggests gingivitis or periodontitis.' },
    { name:'Jaw Area',          img: M('Dentistry','Jaw area swelling.jpg'),             label:'Jaw & TMJ Examination',        desc:'Inspect jaw symmetry, swelling and range of motion. Palpate TMJ for clicking or tenderness.' },
    { name:'Emergency View',    img: M('Dentistry','emermed.jpg'),              label:'Dental Emergency Assessment',  desc:'Acute dental trauma or abscess. Assess for swelling, sinus tract or mobility.' },
  ],
  'ENT': [
    { name:'Ear Exam',          img: M('ENT','Inside of Ear.jpg'),   label:'Otoscopic Examination',       desc:'Tympanic membrane view. Assess colour, light reflex, perforation or fluid behind drum.' },
    { name:'Neck Exam',         img: M('ENT','Neck.webp'),            label:'Neck Lymph Node Palpation',   desc:'Palpate anterior and posterior cervical chains. Note size, consistency and tenderness.' },
    { name:'Nasal Exam',        img: M('ENT','Patinet Nose.webp'),    label:'Anterior Rhinoscopy',         desc:'Inspect nasal mucosa, septum and turbinates for deviation, polyps or discharge.' },
    { name:'Sinusitis Check',   img: M('ENT','Sinusitis.webp'),       label:'Sinusitis — Facial Swelling', desc:'Periorbital or facial swelling indicates sinusitis. Press over maxillary/frontal sinuses for tenderness.' },
    { name:'Throat Exam',       img: M('ENT','Throat.webp'),          label:'Oropharynx & Tonsils',        desc:'Assess tonsil size (Grade I–IV), erythema and exudate. Uvular deviation suggests peritonsillar abscess.' },
  ],
  'Emergency': [
    { name:'Wound Assessment',  img: M('Emergency','Wound.jpg'),               label:'Wound Examination',         desc:'Inspect wound for size, depth, contamination, devitalised tissue and signs of infection.' },
    { name:'Abdominal Check',   img: M('Emergency','Abdomin Bruising.jpg'),    label:'Abdominal Bruising',        desc:'Grey-Turner sign (flank bruising) or Cullen sign (periumbilical bruising) suggests retroperitoneal haemorrhage.' },
    { name:'Consciousness',     img: M('Emergency','Altered Conscoiness.webp'), label:'Altered Consciousness',     desc:'Assess GCS (Eyes + Verbal + Motor). GCS ≤8 = severe injury, consider intubation.' },
    { name:'Chest Exam',        img: M('Emergency','Chest patient.jpg'),       label:'Chest Trauma Assessment',   desc:'Inspect for asymmetry, paradoxical movement, penetrating wounds or flail segment.' },
    { name:'Limb Assessment',   img: M('Emergency','Limb.png'),                label:'Limb Trauma Examination',   desc:'Assess for deformity, swelling, neurovascular status. Compare bilaterally.' },
  ],
  'Eye Specialist': [
    { name:'Red Eye Exam',      img: M('Eye Specialist','Red Eyes.jpg'),         label:'Conjunctival Hyperaemia',    desc:'Diffuse injection suggests conjunctivitis. Ciliary flush (limbal redness) suggests uveitis or keratitis.' },
    { name:'Pupil Exam',        img: M('Eye Specialist','Pupil Close Up.jpg'),   label:'Pupil Assessment',           desc:'Assess size, shape and reactivity. RAPD (swinging light test) indicates optic nerve pathology.' },
    { name:'Retina Exam',       img: M('Eye Specialist','Retina - Fundus.jpg'),  label:'Fundus Examination',         desc:'Assess optic disc, cup:disc ratio, macula, vessels. Papilloedema or haemorrhages are red flags.' },
    { name:'Eyelid Exam',       img: M('Eye Specialist','Eyelild dropping.png'), label:'Eyelid Assessment (Ptosis)', desc:'Ptosis (drooping eyelid) may indicate Horner syndrome, CN III palsy or myasthenia gravis.' },
    { name:'Eye Symmetry',      img: M('Eye Specialist','Eyes assymetry.jpg'),   label:'Ocular Symmetry Assessment', desc:'Asymmetry in pupil size (anisocoria) or eye position (strabismus). Compare both eyes carefully.' },
  ],
  'Orthopedics': [
    { name:'Knee Exam',         img: M('Orthopedics','Swollen Knee Joint.jfif'), label:'Swollen Knee Joint',         desc:'Effusion, warmth and restricted ROM. Ballottement test for fluid. Consider septic arthritis.' },
    { name:'Spine Exam',        img: M('Orthopedics','Scoliosis.jpg'),          label:'Spinal Curvature (Scoliosis)',desc:'Lateral spinal curvature. Adam forward bend test — rib hump indicates structural scoliosis.' },
    { name:'Hand & Wrist',      img: M('Orthopedics','Hand-Wrist.jfif'),        label:'Hand & Wrist Examination',   desc:'Inspect for swelling, deformity, thenar wasting. Phalen and Tinel tests for carpal tunnel syndrome.' },
    { name:'Hip Assessment',    img: M('Orthopedics','Hip Area.jfif'),          label:'Hip Joint Examination',      desc:'Thomas test for fixed flexion deformity. Trendelenburg for abductor weakness. Log roll for hip pain.' },
    { name:'Foot & Ankle',      img: M('Orthopedics','Foot-Ankle.jpg'),         label:'Foot & Ankle Assessment',    desc:'Assess arch, alignment and gait. Simmond test for Achilles rupture. Note any deformity or swelling.' },
  ],
  'Pediatrics': [
    { name:'Throat Exam',       img: M('Pediatrics','Strep-throat.jpg'),  label:'Paediatric Throat — Strep',  desc:'Bright red pharynx with exudate on tonsils. Classic streptococcal pharyngitis appearance.' },
    { name:'Ear Exam',          img: M('Pediatrics','Ear canal.webp'),    label:'Paediatric Ear Canal',       desc:'Otoscopy in child. Look for otitis media: erythematous, bulging TM with loss of light reflex.' },
    { name:'Skin Rash',         img: M('Pediatrics','Skin rash.webp'),    label:'Paediatric Skin Rash',       desc:'Maculopapular rash. Note distribution, morphology and associated symptoms (fever, itch).' },
    { name:'Abdomen Exam',      img: M('Pediatrics','Abdomen.jpg'),       label:'Paediatric Abdominal Exam',  desc:'Inspect for distension or visible peristalsis. Palpate gently — children may guard involuntarily.' },
    { name:'Lymph Nodes',       img: M('Pediatrics','Swollen Node.jpg'),  label:'Cervical Lymphadenopathy',   desc:'Enlarged cervical nodes in child. Tender = reactive/infective. Hard, non-tender = malignancy risk.' },
  ],
  'Psychiatry': [
    { name:'Appearance & Mood', img: M('Psychiatry','Low Mood.jpg'),      label:'Appearance & Mood Assessment', desc:'Observe facial expression, affect and eye contact. Flat affect, tearfulness or agitation are significant.' },
    { name:'Posture & Behavior',img: M('Psychiatry','Postur.webp'),       label:'Psychomotor Observation',      desc:'Note body posture, psychomotor retardation or agitation. Withdrawal and slouching suggest depression.' },
    { name:'Self-harm Signs',   img: M('Psychiatry','Nail-bitting.jpg'),  label:'Anxiety — Physical Signs',     desc:'Nail biting, hair pulling or self-harm marks. Physical manifestations of anxiety or OCD.' },
    { name:'Eye Contact',       img: M('Psychiatry','Eyes.jpg'),          label:'Eye Contact & Affect',         desc:'Assess eye contact quality. Poor contact suggests withdrawal. Wide, fixed stare may indicate mania or psychosis.' },
    { name:'Grooming',          img: M('Psychiatry','Grooming.jpg'),      label:'Self-Care & Grooming',         desc:'Assess hygiene and grooming. Neglected appearance in a previously well-groomed patient is a red flag.' },
  ],
  'Gynecology': [
    { name:'Abdomen Exam',      img: M('General Medicine','Abdomin.jpg'),      label:'Gynaecological Abdominal Exam', desc:'Inspect for uterine enlargement, tenderness or masses. Measure symphysis-fundal height if pregnant.' },
    { name:'Skin Pallor',       img: M('General Medicine','Sclera.jfif'),      label:'Pallor Assessment',             desc:'Check conjunctival and palmar pallor for anaemia. Common in menorrhagia and gynaecological conditions.' },
    { name:'Leg Swelling',      img: M('Cardiology','Oidema.webp'),            label:'Lower Limb Oedema',             desc:'Pitting oedema in pregnancy may indicate pre-eclampsia. Asymmetric swelling suggests DVT.' },
    { name:'Skin Exam',         img: M('General Medicine','Skin Rash.jfif'),   label:'Skin Changes in Pregnancy',     desc:'Linea nigra, chloasma (melasma), striae gravidarum are normal. Pruritic rash needs further assessment.' },
    { name:'Throat & General',  img: M('General Medicine','Tonsils.webp'),     label:'General Systemic Exam',         desc:'Assess general health. Infections during pregnancy require urgent attention.' },
  ],
  'Cardiology': [
    { name:'JVP Assessment',    img: M('Cardiology','JVP viens.webp'),            label:'Jugular Venous Pressure (JVP)', desc:'Elevated JVP (>4cm above sternal angle) indicates raised right heart pressure or fluid overload.' },
    { name:'Oedema Check',      img: M('Cardiology','Oidema.webp'),               label:'Pitting Oedema',               desc:'Press tibia for 5 seconds. Pitting oedema graded 1–4+. Bilateral suggests cardiac or renal cause.' },
    { name:'Clubbing & Cyanosis',img: M('Cardiology','clubbing, cyanosis.jpeg'),  label:'Clubbing & Peripheral Cyanosis', desc:'Digital clubbing in cyanotic heart disease. Peripheral cyanosis (blue fingertips) = reduced perfusion.' },
    { name:'Chest Exam',        img: M('General Medicine','Patinet Chest'),        label:'Precordial Examination',       desc:'Inspect for visible pulsations, scars (CABG, pacemaker). Palpate apex beat and heaves.' },
    { name:'Neck Veins',        img: M('ENT','Neck.webp'),                         label:'Neck Vessel Assessment',       desc:'Inspect carotid pulsations and JVP simultaneously. Carotid bruit suggests atherosclerosis.' },
  ],
};

const DEPT_TESTS = {
  'General Medicine': ['CBC','Urine Analysis','X-Ray','Blood Glucose','LFT'],
  'Pediatrics':       ['CBC','Blood Culture','Urine Analysis','X-Ray','Blood Glucose'],
  'Gynecology':       ['Ultrasound','Pregnancy Test','CBC','Urine Culture','Hormonal Panel'],
  'Dentistry':        ['Dental X-Ray','Panoramic X-Ray','Bite Wing X-Ray'],
  'Eye Specialist':   ['Visual Field Test','OCT Scan','Fluorescein Angiography'],
  'ENT':              ['Audiometry','X-Ray Sinuses','Throat Culture','CT Scan'],
  'Psychiatry':       ['Psychiatric Eval','Blood Tests','Thyroid Panel','Neuroimaging'],
  'Emergency':        ['ECG','CBC','ABG','CT Head','Blood Glucose'],
  'Cardiology':       ['ECG','Echo','Stress Test','Troponin','Lipid Panel'],
  'Orthopedics':      ['X-Ray','MRI','CT Scan','Bone Density','Uric Acid'],
};

// Test result images — maps test name → image path (from public/medical/)
const TEST_IMAGES = {
  // Dentistry
  'Dental X-Ray':      { img: '/medical/X Rays/Dentistry/Dentistry.jpeg',   label: 'Dental X-Ray', finding: 'Periapical X-ray reveals evidence of carious lesion with possible pulpal involvement. Bone levels appear normal. No periapical pathology detected.' },
  'Panoramic X-Ray':   { img: '/medical/X Rays/Dentistry/Panoramic.webp',   label: 'Panoramic X-Ray', finding: 'Panoramic radiograph shows all teeth present. Mild alveolar bone loss noted. Impacted third molar observed in lower right quadrant.' },
  'Bite Wing X-Ray':   { img: '/medical/X Rays/Dentistry/Bite wing.jpg',    label: 'Bite Wing X-Ray', finding: 'Bite-wing radiograph reveals interproximal caries between premolars. Overhanging restoration noted on lower left molar.' },
  // General Medicine / Shared
  'CBC':               { img: null, label: 'Complete Blood Count', finding: 'WBC: 11.2 × 10³/μL (elevated) | RBC: 4.1 × 10⁶/μL | Hgb: 12.8 g/dL (low) | Platelets: 210 × 10³/μL. Findings suggest mild anaemia and leukocytosis consistent with infection.' },
  'X-Ray':             { img: '/medical/X Rays/General Medicine/Chest.jpg',  label: 'Chest X-Ray', finding: 'PA chest X-ray shows clear lung fields bilaterally. No consolidation, effusion or pneumothorax. Cardiothoracic ratio within normal limits.' },
  'Urine Analysis':    { img: null, label: 'Urinalysis', finding: 'Colour: yellow, clear. pH 6.0. Protein: trace. Glucose: negative. Nitrites: negative. Leukocyte esterase: 1+. Microscopy: 5–10 WBCs/HPF.' },
  'Blood Glucose':     { img: null, label: 'Blood Glucose', finding: 'Fasting blood glucose: 118 mg/dL (mildly elevated). HbA1c: 6.1% (pre-diabetic range). Repeat fasting glucose recommended in 3 months.' },
  'LFT':               { img: null, label: 'Liver Function Tests', finding: 'ALT: 42 U/L | AST: 38 U/L | ALP: 95 U/L | Bilirubin total: 0.9 mg/dL | Albumin: 4.1 g/dL. All values within normal limits.' },
  // Gynecology
  'Ultrasound':        { img: '/medical/X Rays/Gynaecology/Ultrasound.webp', label: 'Pelvic Ultrasound', finding: 'Uterus: anteverted, normal size. Endometrial thickness: 9mm. Right ovary: 3.2 × 2.1 cm, small follicular cyst noted. Left ovary: normal. No free fluid.' },
  'Pregnancy Test':    { img: null, label: 'Pregnancy Test', finding: 'Serum beta-hCG: 3 mIU/mL. Result: Negative. Patient is not pregnant at this time.' },
  'Urine Culture':     { img: null, label: 'Urine Culture', finding: 'Culture: No growth after 48 hours. Sensitivity: N/A. No urinary tract infection detected.' },
  'Hormonal Panel':    { img: null, label: 'Hormonal Panel', finding: 'FSH: 6.2 mIU/mL | LH: 5.1 mIU/mL | Estradiol: 82 pg/mL | Progesterone: 1.4 ng/mL | TSH: 2.1 mIU/L. Values suggest normal ovarian reserve.' },
  // ENT
  'Audiometry':        { img: '/medical/X Rays/ENT/Sinus.jpg',               label: 'Audiometry', finding: 'Pure tone audiogram shows mild conductive hearing loss in right ear (30 dB at 500–2000 Hz). Left ear: within normal limits. Weber test lateralises to right.' },
  'X-Ray Sinuses':     { img: '/medical/X Rays/ENT/Sinus.jpg',               label: 'Sinus X-Ray', finding: 'Waters view X-ray shows opacification of right maxillary sinus with air-fluid level. Left sinuses clear. Findings consistent with acute maxillary sinusitis.' },
  'Throat Culture':    { img: null,                                           label: 'Throat Culture', finding: 'Culture: Streptococcus pyogenes (Group A Strep) isolated. Sensitive to penicillin and amoxicillin. Resistant to erythromycin.' },
  'CT Scan':           { img: '/medical/X Rays/Emergency/CT Head.jpg',        label: 'CT Scan', finding: 'CT neck with contrast: No abscess identified. Mild cervical lymphadenopathy bilaterally (largest node 1.2 cm). No airway compromise.' },
  // Eye Specialist
  'Visual Field Test': { img: '/medical/X Rays/Eye Specialist/Retina.png',   label: 'Visual Field Test', finding: 'Humphrey visual field 24-2: Mild superior arcuate scotoma in right eye. Left eye: within normal limits. Pattern deviation significant (p<5%). Glaucoma monitoring advised.' },
  'OCT Scan':          { img: '/medical/X Rays/Eye Specialist/OCT.jpg',       label: 'OCT Scan', finding: 'Retinal nerve fibre layer: borderline thinning in inferotemporal quadrant OD. Macular thickness: 285 μm OU (within normal range). No drusen or subretinal fluid.' },
  'Fluorescein Angiography': { img: '/medical/X Rays/Eye Specialist/Retina.png', label: 'Fluorescein Angiography', finding: 'Early phase: normal choroidal flush. Late phase: mild hyperfluorescence at optic disc margin. No neovascularisation or leakage detected.' },
  // Emergency
  'ECG':               { img: '/medical/X Rays/Cardiology/ECG.png',           label: 'ECG / EKG', finding: 'Sinus rhythm, rate 88 bpm. Normal axis. PR interval: 0.16s. QRS: 0.08s. QTc: 420ms. No ST changes. No conduction abnormalities detected.' },
  'ABG':               { img: null, label: 'Arterial Blood Gas', finding: 'pH: 7.38 | PaCO₂: 40 mmHg | PaO₂: 88 mmHg | HCO₃: 24 mEq/L | SpO₂: 97%. Interpretation: Normal acid-base balance. Mild hypoxaemia on room air.' },
  'CT Head':           { img: '/medical/X Rays/Emergency/CT Head.jpg',        label: 'CT Head', finding: 'Non-contrast CT brain: No intracranial haemorrhage. No midline shift. Ventricles normal in size. Cortical sulci preserved. No space-occupying lesion.' },
  // Psychiatry
  'Psychiatric Eval':  { img: null,                                           label: 'Psychiatric Evaluation', finding: 'Patient appears alert and oriented ×3. Mood: depressed. Affect: blunted. Thought process: coherent. No psychosis or suicidal ideation. PHQ-9 score: 14 (moderate depression).' },
  'Thyroid Panel':     { img: null, label: 'Thyroid Panel', finding: 'TSH: 2.4 mIU/L | Free T4: 1.1 ng/dL | Free T3: 3.2 pg/mL. All values within normal limits. No thyroid dysfunction detected.' },
  'Neuroimaging':      { img: '/medical/X Rays/Emergency/CT Head.jpg',        label: 'Neuroimaging (MRI Brain)', finding: 'MRI brain with/without contrast: No structural abnormality. Cortical volume age-appropriate. No white matter lesions. Hippocampal volume mildly reduced bilaterally.' },
  // Cardiology
  'Echo':              { img: '/medical/X Rays/Cardiology/CHest.png',         label: 'Echocardiogram', finding: 'LV ejection fraction: 58% (normal). No wall motion abnormalities. Mild mitral regurgitation. No pericardial effusion. Valves otherwise structurally normal.' },
  'Stress Test':       { img: '/medical/X Rays/Cardiology/CHest.png',         label: 'Stress Test', finding: 'Exercise stress test: Patient achieved 85% MPHR. No chest pain. No ST depression at peak stress. Normal chronotropic response. Low-risk result.' },
  'Troponin':          { img: null, label: 'Troponin', finding: 'High-sensitivity Troponin I: 0.006 ng/mL (normal <0.04). Serial troponin at 3h: 0.007 ng/mL. No significant rise. Myocardial infarction effectively ruled out.' },
  'Lipid Panel':       { img: null, label: 'Lipid Panel', finding: 'Total cholesterol: 210 mg/dL | LDL: 138 mg/dL (borderline high) | HDL: 45 mg/dL | Triglycerides: 160 mg/dL. Dietary modification and reassessment in 6 months recommended.' },
  // Orthopedics
  'MRI':               { img: '/medical/X Rays/Orthopedics/Knee.jpg',         label: 'MRI', finding: 'MRI right knee: Medial meniscus posterior horn: Grade II signal change (degenerative, no tear). ACL intact. Mild joint effusion. Early cartilage thinning medial compartment.' },
  'Bone Density':      { img: '/medical/X Rays/Orthopedics/Spine.webp',       label: 'DEXA Bone Density', finding: 'Lumbar spine T-score: −1.2 (osteopenia). Femoral neck T-score: −0.9 (normal). WHO classification: Osteopenia. Calcium and Vitamin D supplementation advised.' },
  'Uric Acid':         { img: null, label: 'Uric Acid', finding: 'Serum uric acid: 7.8 mg/dL (elevated; normal <7.0 in males). Clinical correlation recommended. Consider gout in differential if symptomatic.' },
  // Pediatrics
  'Blood Culture':     { img: null, label: 'Blood Culture', finding: 'Blood culture × 2 sets: No growth after 72 hours. No bacteraemia detected. Viral aetiology remains possible.' },
};

// Duration in seconds for each test  
const TEST_DURATION_SEC = 5;

export default function ConsultationPage() {
  const { session, messages, addMessage, addExam, testsOrdered, addTest, removeTest, submitReport } = useSession();
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voiceMode, setVoiceMode]   = useState(false);
  // ── Voice dictation panel (speech-to-text input) ──────────────────────
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isTalking, setIsTalking]   = useState(false);
  const [expression, setExpression] = useState(null);
  const [timer, setTimer]           = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [testModal, setTestModal]   = useState(null); // { test, phase: 'processing'|'result', progress: 0 }
  const [testResults, setTestResults] = useState({}); // { testName: true } — completed tests
  const [testReports, setTestReports] = useState({}); // { testName: reportText } — AI-generated reports
  const [reportModal, setReportModal] = useState(null); // { testName, reportText } — view report modal
  const [submitForm, setSubmitForm] = useState({ primaryDiagnosis:'', differentialDiagnosis:'', counsellingNotes:'' });
  const [drugs, setDrugs]           = useState([{ drugName:'', dose:'', route:'Oral', frequency:'', duration:'' }]);
  const [examModal, setExamModal]   = useState(null);
  const chatRef   = useRef(null);
  const navigate  = useNavigate();

  const dept  = session?.department || 'General Medicine';
  const exams = DEPT_EXAMS[dept]    || DEPT_EXAMS['General Medicine'];
  const tests = DEPT_TESTS[dept]    || DEPT_TESTS['General Medicine'];

  useEffect(() => {
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const progress   = Math.min(100, Math.round((messages.length / 20) * 100));

  // Initialise Web Speech voices as early as possible (handles Electron async load)
  useEffect(() => {
    initVoices();
    // Stop any residual speech when leaving the consultation page
    return () => stopSpeech();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput(''); setLoading(true);
    addMessage('Student', text);
    try {
      // NOTE: voiceMode is kept in state (the toggle UI is preserved).
       
      // TTS is handled entirely client-side. Backend flow is unchanged.
      const res = await sessionAPI.message(text, false);
      const reply = res.data.patientReply;
      addMessage('Patient', reply);

      if (voiceMode && reply) {
        // ── Browser TTS (replaces ElevenLabs) ────────────────────────────
        // Build patientData from current session context so voiceService can
        // select the correct pitch/rate/voice without any backend changes.
        const patientData = {
          ageGroup:       session?.ageGroup,       // e.g. 'Child', 'Adult', 'Senior'
          personality:    session?.personality,    // e.g. 'Anxious & Overthinking'
          emotionalState: session?.emotionalState, // e.g. 'Anxious', 'Calm'
          characterName:  session?.patientCharacter, // e.g. 'Saba Parveen'
        };

        setIsTalking(true);

        speakPatientReply(reply, patientData, () => {
          // onEnd callback — stop talking animation when speech finishes
          setIsTalking(false);
        });

        // Also set a time-based safety fallback in case onEnd doesn't fire
        // (can happen if browser cancels speech silently)
        const safeDuration = Math.max(3000, reply.length * 55);
        setTimeout(() => setIsTalking(false), safeDuration);

      } else {
        // Voice mode is off — still animate mouth for visual feedback
        setIsTalking(true);
        const speakDuration = Math.max(2000, reply.length * 60);
        setTimeout(() => setIsTalking(false), speakDuration);
      }

    } catch {
      addMessage('System', 'Connection error. Please try again.');
    } finally { setLoading(false); }
  };

  const handleExam = async (exam) => {
    setExamModal(exam);
    try { await sessionAPI.examine(exam.name); addExam(exam.name); } catch {}
  };

  const handleOrderTest = async (test) => {
    // If already completed, show the result again
    if (testResults[test]) {
      setTestModal({ test, phase: 'result', progress: 100 });
      return;
    }
    // If currently processing, do nothing
    if (testModal?.test === test && testModal?.phase === 'processing') return;

    // Start processing
    setTestModal({ test, phase: 'processing', progress: 0 });
    try { await sessionAPI.orderTest(test); addTest(test); } catch {}

    // Kick off report generation in background (don't block the animation)
    const buildTranscript = () => messages
      .filter(m => m.sender === 'Student' || m.sender === 'Patient')
      .map(m => `${m.sender}: ${m.text}`)
      .join('\n');

    sessionAPI.generateReport(test, dept, buildTranscript())
      .then(res => {
        const reportText = res.data?.report || 'Report unavailable.';
        setTestReports(prev => ({ ...prev, [test]: reportText }));
      })
      .catch(() => {
        setTestReports(prev => ({ ...prev, [test]: 'Report generation failed. Please try again.' }));
      });

    // Animate progress 0→100 over TEST_DURATION_SEC seconds
    const totalMs   = TEST_DURATION_SEC * 1000;
    const intervalMs = 200;
    const steps      = totalMs / intervalMs;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / steps) * 100));
      setTestModal(prev => prev ? { ...prev, progress: pct } : null);
      if (step >= steps) {
        clearInterval(timer);
        setTestResults(prev => ({ ...prev, [test]: true }));
        setTestModal({ test, phase: 'result', progress: 100 });
      }
    }, intervalMs);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await sessionAPI.submit({
        primaryDiagnosis:      submitForm.primaryDiagnosis,
        differentialDiagnosis: submitForm.differentialDiagnosis,
        counsellingNotes:      submitForm.counsellingNotes,
        drugs: drugs.filter(d => d.drugName.trim())
      });
      submitReport(res.data);
      navigate('/report');
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed.');
      setSubmitting(false);
    }
  };

  return (
    <div style={S.shell}>
      <div style={S.header}>
        <span style={S.deptTag}>{dept}</span>
        <span style={S.timer}>⏱ Session Time: {formatTime(timer)}</span>
        <span style={S.caseId}>Case #{session?.caseId || '—'}</span>
      </div>

      <div style={S.body}>
        {/* LEFT */}
        <div style={S.leftPanel}>
          <div style={S.charBox}>
            <div style={S.charPlaceholder}>
              <PatientCharacter
                characterName={session?.patientCharacter}
                isTalking={isTalking}
                expression={expression}
              />
            </div>
          </div>
          <div style={S.patientInfo}>
            <InfoRow label="Name"       value={session?.patientCharacter} />
            <InfoRow label="Age Group"  value={session?.ageGroup} />
            <InfoRow label="Department" value={dept} />
          </div>
          <div style={S.tagsBlock}>
            <span style={S.tagLabel}>Emotional State</span>
            <div style={S.tags}>
              <span className="badge badge-orange">Active</span>
              <span className="badge badge-purple">In Session</span>
            </div>
          </div>
          <div style={S.voiceRow}>
            <span style={S.tagLabel}>Voice Mode</span>
            <button style={{...S.toggle, background: voiceMode?'var(--purple-primary)':'var(--border)'}}
              onClick={() => setVoiceMode(v=>!v)}>
              <div style={{...S.toggleThumb, transform: voiceMode?'translateX(20px)':'translateX(0)'}}/>
            </button>
          </div>
        </div>

        {/* MIDDLE */}
        <div style={S.chatPanel}>
          <div ref={chatRef} style={S.chatWindow}>
            {messages.length === 0 && (
              <div style={S.chatEmpty}>
                <span style={{fontSize:32}}>💬</span>
                <p>Start the consultation by greeting your patient.</p>
              </div>
            )}
            {messages.map((msg,i) => (
              <div key={i} style={{...S.bubble,
                ...(msg.sender==='Student'?S.bStudent:msg.sender==='Patient'?S.bPatient:S.bSystem)}}>
                {msg.sender !== 'Student' && <div style={S.bSender}>{msg.sender}</div>}
                <p style={S.bText}>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div style={{...S.bubble,...S.bPatient}}>
                <div style={S.bSender}>Patient</div>
                <div style={S.typing}><span/><span/><span/></div>
              </div>
            )}
          </div>
          <div style={S.inputRow}>
            {showVoiceRecorder ? (
              /* ── Inline voice dictation bar — replaces input in place ── */
              <VoiceRecorder
                onConfirm={(text) => {
                  if (text && text.trim()) {
                    setInput(prev => {
                      const base = prev.trim();
                      return base ? base + ' ' + text.trim() : text.trim();
                    });
                  }
                  setShowVoiceRecorder(false);
                }}
                onClose={() => setShowVoiceRecorder(false)}
              />
            ) : (
              /* ── Normal input row ──────────────────────────────────── */
              <>
                <button
                  style={S.micBtn}
                  onClick={() => setShowVoiceRecorder(true)}
                  title="Voice input"
                  disabled={loading}
                >
                  <MicIcon />
                </button>
                <input style={S.chatInput} value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
                  placeholder="Type your question or observation..."
                  disabled={loading} maxLength={500}/>
                <button style={S.sendBtn} onClick={sendMessage} disabled={loading||!input.trim()}>
                  {loading?<Spinner white/>:'➤'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={S.rightPanel}>
          <h3 style={S.panelTitle}>Clinical Tools</h3>
          <div style={S.toolSection}>
            <h4 style={S.toolLabel}>Physical Examination</h4>
            <p style={S.toolHint}>Click to view patient image</p>
            <div style={S.examGrid}>
              {exams.map(exam => (
                <button key={exam.name}
                  style={{...S.examBtn,...(examModal?.name===exam.name?S.examBtnActive:{})}}
                  onClick={()=>handleExam(exam)}>
                  {exam.name}
                </button>
              ))}
            </div>
          </div>
          <div style={S.divider}/>
          <div style={S.toolSection}>
            <h4 style={S.toolLabel}>Order Tests</h4>
            <p style={S.toolHint}>Click to process & view result</p>
            <div style={S.testList}>
              {tests.map(test => {
                const done    = testResults[test];
                const running = testModal?.test === test && testModal?.phase === 'processing';
                const hasReport = !!testReports[test];
                const reportReady = done && hasReport;
                const reportLoading = done && !hasReport;
                return (
                  <div key={test} style={{display:'flex',flexDirection:'column',gap:3}}>
                    <button style={{...S.testBtn,
                      ...(done    ? S.testBtnDone    : {}),
                      ...(running ? S.testBtnRunning : {})
                    }} onClick={() => handleOrderTest(test)} disabled={running}>
                      <span style={S.testBtnIcon}>
                        {done ? '✅' : running ? '⏳' : '🔬'}
                      </span>
                      <span style={S.testBtnName}>{test}</span>
                      {done && <span style={S.testBtnView}>View →</span>}
                      {running && <span style={S.testBtnView}>{testModal.progress}%</span>}
                    </button>
                    {done && (
                      <button
                        style={{...S.viewReportBtn, ...(reportLoading ? S.viewReportBtnLoading : {})}}
                        onClick={() => reportReady && setReportModal({ testName: test, reportText: testReports[test] })}
                        disabled={reportLoading}
                      >
                        {reportLoading
                          ? <><span style={{animation:'spin 0.7s linear infinite',display:'inline-block'}}>⏳</span> Generating report…</>
                          : <>📋 View Report</>
                        }
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={S.divider}/>
          <div style={S.progressBox}>
            <div style={S.progressLabel}>
              <span style={{color:'var(--purple-primary)',fontWeight:700,fontFamily:'var(--font-head)',fontSize:13}}>Session Progress</span>
              <span style={{fontSize:13,fontWeight:700,color:'var(--text-mid)'}}>{progress}%</span>
            </div>
            <div style={S.progressBar}><div style={{...S.progressFill,width:`${progress}%`}}/></div>
          </div>
          <button className="btn-primary" style={S.submitBtn} onClick={()=>setShowSubmit(true)}>
            SUBMIT SESSION
          </button>
        </div>
      </div>

      {/* ── Test Processing / Result Modal ────────────────────────────────── */}
      {testModal && (() => {
        const info = TEST_IMAGES[testModal.test] || { label: testModal.test, finding: 'Results pending.', img: null };
        const isProcessing = testModal.phase === 'processing';
        return (
          <div style={S.overlay} onClick={() => { if (!isProcessing) setTestModal(null); }}>
            <div style={S.examModal} onClick={e => e.stopPropagation()} className="page-enter">
              <div style={S.examHeader}>
                <div style={{ flex: 1 }}>
                  <div style={S.examDept}>{dept} — Diagnostic Test</div>
                  <h2 style={S.examTitle}>{info.label}</h2>
                  {isProcessing
                    ? <p style={S.examDesc}>Processing your test request. Please wait…</p>
                    : <p style={S.examDesc}>{info.finding}</p>
                  }
                </div>
                {!isProcessing && (
                  <button style={S.closeBtn} onClick={() => setTestModal(null)}>✕</button>
                )}
              </div>

              {isProcessing ? (
                <div style={S.testProcessingBox}>
                  <div style={S.testScanAnim}>
                    <div style={S.testScanLine} />
                    <div style={S.testScanGrid}>
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} style={{
                          ...S.testScanCell,
                          opacity: Math.random() * 0.5 + (testModal.progress / 200),
                        }} />
                      ))}
                    </div>
                  </div>
                  <div style={S.testProgressWrap}>
                    <div style={S.testProgressLabel}>
                      <span style={{ fontWeight: 700, color: 'var(--purple-primary)', fontFamily: 'var(--font-head)' }}>
                        🔬 Processing {testModal.test}…
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--purple-primary)', fontFamily: 'var(--font-head)', fontSize: 16 }}>
                        {testModal.progress}%
                      </span>
                    </div>
                    <div style={S.testProgressBar}>
                      <div style={{ ...S.testProgressFill, width: `${testModal.progress}%` }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', marginTop: 6 }}>
                      {testModal.progress < 30  ? 'Initialising equipment…'
                      : testModal.progress < 60 ? 'Acquiring scan data…'
                      : testModal.progress < 85 ? 'Processing image…'
                      :                           'Generating report…'}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {info.img ? (
                    <div style={S.imgBox}>
                      <img src={info.img} alt={info.label} style={S.examImg}
                        onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div style={{ ...S.imgFallback, display: 'none' }}>
                        <span style={{ fontSize: 48 }}>🩻</span>
                        <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Image not available.<br />Place image in <code>public/medical/{dept}/</code></p>
                      </div>
                    </div>
                  ) : (
                    <div style={S.testReportBox}>
                      <div style={S.testReportHeader}>📋 Lab Report</div>
                      <p style={S.testReportText}>{info.finding}</p>
                    </div>
                  )}
                  <div style={S.examFooter}>
                    <span style={S.recorded}>✓ Test result recorded in session</span>
                    <button className="btn-primary" onClick={() => setTestModal(null)}>Close & Continue →</button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Exam Image Modal ──────────────────────────────────────────────── */}
      {examModal && (
        <div style={S.overlay} onClick={()=>setExamModal(null)}>
          <div style={S.examModal} onClick={e=>e.stopPropagation()} className="page-enter">
            <div style={S.examHeader}>
              <div style={{flex:1}}>
                <div style={S.examDept}>{dept} — Physical Examination</div>
                <h2 style={S.examTitle}>{examModal.label}</h2>
                <p style={S.examDesc}>{examModal.desc}</p>
              </div>
              <button style={S.closeBtn} onClick={()=>setExamModal(null)}>✕</button>
            </div>
            <div style={S.imgBox}>
              <img
                src={examModal.img}
                alt={examModal.label}
                style={S.examImg}
                onError={e=>{
                  e.target.onerror=null;
                  e.target.style.display='none';
                  e.target.nextSibling.style.display='flex';
                }}
              />
              <div style={{...S.imgFallback, display:'none'}}>
                <span style={{fontSize:48}}>🩻</span>
                <p style={{color:'var(--text-light)',fontSize:14}}>Image not loaded.<br/>Place image in <code>public/medical/{dept}/</code></p>
              </div>
            </div>
            <div style={S.examFooter}>
              <span style={S.recorded}>✓ Examination recorded in session</span>
              <button className="btn-primary" onClick={()=>setExamModal(null)}>Close & Continue →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Test Report Modal ──────────────────────────────────────────── */}
      {reportModal && (
        <div style={S.overlay} onClick={() => setReportModal(null)}>
          <div style={{...S.examModal, maxWidth:680}} onClick={e => e.stopPropagation()} className="page-enter">
            <div style={S.examHeader}>
              <div style={{flex:1}}>
                <div style={S.examDept}>{dept} — AI Diagnostic Report</div>
                <h2 style={S.examTitle}>📋 {reportModal.testName}</h2>
                <p style={{...S.examDesc, color:'var(--purple-primary)', fontWeight:600, fontSize:12}}>
                  Generated from patient conversation — clinically contextualised
                </p>
              </div>
              <button style={S.closeBtn} onClick={() => setReportModal(null)}>✕</button>
            </div>
            <div style={S.aiReportBox}>
              <pre style={S.aiReportText}>{reportModal.reportText}</pre>
            </div>
            <div style={{background:'#FFF8E1',border:'1px solid #FFE082',borderRadius:'var(--radius-md)',padding:'10px 14px',fontSize:12,color:'#7B6000',lineHeight:1.5}}>
              ⚠️ This report is AI-generated based on the patient simulation. Use it to guide your clinical reasoning and prescription decisions.
            </div>
            <div style={S.examFooter}>
              <span style={S.recorded}>✓ Report based on live session transcript</span>
              <button className="btn-primary" onClick={() => setReportModal(null)}>Close & Continue →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit Modal ──────────────────────────────────────────────────── */}
      {showSubmit && (
        <div style={S.overlay}>
          <div style={S.submitModal} className="page-enter">
            <h3 style={S.modalTitle}>Submit Case</h3>
            <p style={S.modalSub}>Fill in your clinical conclusions before submitting.</p>
            <Field label="Primary Diagnosis *" value={submitForm.primaryDiagnosis} placeholder="e.g. Dental Caries — Cavity"
              onChange={v=>setSubmitForm(f=>({...f,primaryDiagnosis:v}))} />
            <Field label="Differential Diagnoses" value={submitForm.differentialDiagnosis} placeholder="e.g. Pulpitis, Cracked Tooth Syndrome"
              onChange={v=>setSubmitForm(f=>({...f,differentialDiagnosis:v}))} />
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={S.fieldLabel}>Prescription</label>
              {drugs.map((d,i) => (
                <div key={i} style={S.drugRow}>
                  <input placeholder="Drug name" value={d.drugName} style={{flex:2}} onChange={e=>{const nd=[...drugs];nd[i].drugName=e.target.value;setDrugs(nd);}}/>
                  <input placeholder="Dose"      value={d.dose}     style={{flex:1}} onChange={e=>{const nd=[...drugs];nd[i].dose=e.target.value;setDrugs(nd);}}/>
                  <input placeholder="Frequency" value={d.frequency} style={{flex:1}} onChange={e=>{const nd=[...drugs];nd[i].frequency=e.target.value;setDrugs(nd);}}/>
                  <input placeholder="Duration"  value={d.duration}  style={{flex:1}} onChange={e=>{const nd=[...drugs];nd[i].duration=e.target.value;setDrugs(nd);}}/>
                </div>
              ))}
              <button style={S.addDrug} onClick={()=>setDrugs(d=>[...d,{drugName:'',dose:'',route:'Oral',frequency:'',duration:''}])}>+ Add Drug</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={S.fieldLabel}>Counselling Notes</label>
              <textarea value={submitForm.counsellingNotes} rows={3} maxLength={1000}
                onChange={e=>setSubmitForm(f=>({...f,counsellingNotes:e.target.value}))}
                placeholder="Patient education, lifestyle advice..."/>
            </div>
            <div style={S.modalBtns}>
              <button className="btn-secondary" onClick={()=>setShowSubmit(false)} disabled={submitting}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting||!submitForm.primaryDiagnosis.trim()}>
                {submitting?<Spinner white/>:'Submit for Evaluation →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8"  y1="22" x2="16" y2="22" />
    </svg>
  );
}
function InfoRow({ label, value }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{fontSize:11,color:'var(--text-light)',fontWeight:500}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,fontFamily:'var(--font-head)',color:'var(--text-dark)',textAlign:'right',maxWidth:130}}>{value}</span>
    </div>
  );
}
function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <label style={{fontSize:13,fontWeight:600,color:'var(--text-mid)',fontFamily:'var(--font-head)'}}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={500}/>
    </div>
  );
}
function getEmoji(name) {
  return {'Saba Parveen':'😰','Hamza Noor':'😐','Fatima Begum':'🧓','Anas':'😏','Erum':'😶','Shahreyar':'😟','Anum Shahzad':'🙂'}[name]||'🧑';
}
function Spinner({ white }) {
  return <div style={{width:16,height:16,border:`3px solid ${white?'rgba(255,255,255,0.3)':'rgba(123,92,250,0.3)'}`,borderTopColor:white?'#fff':'#7B5CFA',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>;
}

const S = {
  shell:     { display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'var(--bg-main)' },
  header:    { background:'var(--purple-primary)',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 24px',flexShrink:0 },
  deptTag:   { fontFamily:'var(--font-head)',fontWeight:700,fontSize:14 },
  timer:     { fontFamily:'var(--font-head)',fontWeight:800,fontSize:15 },
  caseId:    { fontSize:13,opacity:0.8 },
  body:      { display:'flex',flex:1,overflow:'hidden' },
  leftPanel: { width:240,background:'#fff',borderRight:'1px solid var(--border)',padding:18,display:'flex',flexDirection:'column',gap:14,overflow:'auto',flexShrink:0 },
  charBox:   { display:'flex',justifyContent:'center',paddingTop:4 },
  charPlaceholder: { width:190,height:240,background:'var(--purple-ultra)',borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',justifyContent:'center' },
  charEmoji: { fontSize:72 },
  patientInfo: { display:'flex',flexDirection:'column',gap:8 },
  tagsBlock: { display:'flex',flexDirection:'column',gap:6 },
  tagLabel:  { fontSize:11,color:'var(--text-light)',fontWeight:600,fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:'0.5px' },
  tags:      { display:'flex',gap:6,flexWrap:'wrap' },
  voiceRow:  { display:'flex',justifyContent:'space-between',alignItems:'center' },
  toggle:    { width:44,height:24,borderRadius:99,border:'none',cursor:'pointer',position:'relative',transition:'var(--transition)' },
  toggleThumb: { width:18,height:18,background:'#fff',borderRadius:'50%',position:'absolute',top:3,left:3,transition:'var(--transition)',boxShadow:'0 1px 4px rgba(0,0,0,0.2)' },
  chatPanel: { flex:1,display:'flex',flexDirection:'column',overflow:'hidden' },
  chatWindow: { flex:1,overflow:'auto',padding:'20px 24px',display:'flex',flexDirection:'column',gap:12 },
  chatEmpty: { flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,color:'var(--text-light)',textAlign:'center',fontSize:14 },
  bubble:    { maxWidth:'72%',padding:'10px 14px',borderRadius:'var(--radius-lg)',display:'flex',flexDirection:'column',gap:4 },
  bStudent:  { alignSelf:'flex-end',background:'var(--purple-primary)',color:'#fff',borderBottomRightRadius:4 },
  bPatient:  { alignSelf:'flex-start',background:'#fff',border:'1px solid var(--border)',borderBottomLeftRadius:4 },
  bSystem:   { alignSelf:'center',background:'var(--orange-pale)',border:'1px solid #FFE0B2',color:'var(--orange)' },
  bSender:   { fontSize:10,fontWeight:700,fontFamily:'var(--font-head)',color:'var(--text-light)',textTransform:'uppercase',letterSpacing:'0.5px' },
  bText:     { fontSize:14,lineHeight:1.6,margin:0 },
  typing:    { display:'flex',gap:4,alignItems:'center',padding:'4px 0' },
  inputRow:  { padding:'12px 16px',background:'#fff',borderTop:'1px solid var(--border)',display:'flex',gap:10 },
  micBtn:    { width:44,height:44,border:'none',borderRadius:'var(--radius-md)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'var(--transition)',background:'var(--purple-ultra)',color:'var(--purple-primary)' },
  chatInput: { flex:1,borderRadius:'var(--radius-md)',padding:'11px 16px',border:'1.5px solid var(--border)',fontSize:14 },
  sendBtn:   { width:44,height:44,background:'var(--purple-primary)',border:'none',borderRadius:'var(--radius-md)',color:'#fff',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 },
  rightPanel: { width:260,background:'#fff',borderLeft:'1px solid var(--border)',padding:16,display:'flex',flexDirection:'column',gap:10,overflow:'auto',flexShrink:0 },
  panelTitle: { fontFamily:'var(--font-head)',fontSize:16,fontWeight:800,color:'var(--text-dark)' },
  toolSection: { display:'flex',flexDirection:'column',gap:6 },
  toolLabel: { fontSize:11,fontWeight:700,color:'var(--purple-primary)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:'0.5px' },
  toolHint:  { fontSize:11,color:'var(--text-light)',marginTop:-2 },
  examGrid:  { display:'grid',gridTemplateColumns:'1fr 1fr',gap:5 },
  examBtn:   { background:'var(--bg-main)',border:'1.5px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'7px 5px',fontSize:11,fontWeight:600,fontFamily:'var(--font-head)',color:'var(--text-dark)',cursor:'pointer',transition:'var(--transition)',textAlign:'center',lineHeight:1.3 },
  examBtnActive: { background:'var(--purple-ultra)',borderColor:'var(--purple-primary)',color:'var(--purple-primary)' },
  divider:   { height:1,background:'var(--border)',margin:'2px 0' },
  testList:  { display:'flex',flexDirection:'column',gap:6 },
  testBtn:   { display:'flex',alignItems:'center',gap:8,padding:'8px 10px',border:'1.5px solid var(--border)',borderRadius:'var(--radius-sm)',background:'var(--bg-main)',cursor:'pointer',transition:'var(--transition)',fontSize:12,fontWeight:600,fontFamily:'var(--font-head)',color:'var(--text-dark)',textAlign:'left',width:'100%' },
  testBtnDone:    { background:'#E8F5E9',borderColor:'#4CAF50',color:'#2E7D32' },
  testBtnRunning: { background:'var(--purple-ultra)',borderColor:'var(--purple-primary)',color:'var(--purple-primary)',cursor:'not-allowed',opacity:0.85 },
  testBtnIcon:    { fontSize:14,flexShrink:0 },
  testBtnName:    { flex:1 },
  testBtnView:    { fontSize:11,fontWeight:700,opacity:0.7 },
  viewReportBtn:  { display:'flex',alignItems:'center',gap:6,padding:'5px 10px',border:'1.5px solid var(--purple-primary)',borderRadius:'var(--radius-sm)',background:'var(--purple-ultra)',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:'var(--font-head)',color:'var(--purple-primary)',textAlign:'left',width:'100%',transition:'var(--transition)' },
  viewReportBtnLoading: { opacity:0.6,cursor:'not-allowed',borderColor:'var(--border)',color:'var(--text-light)',background:'var(--bg-main)' },
  aiReportBox:    { background:'#F8F9FA',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'20px 24px',maxHeight:'55vh',overflow:'auto' },
  aiReportText:   { fontSize:13,lineHeight:1.8,color:'var(--text-dark)',fontFamily:"'Courier New', monospace",whiteSpace:'pre-wrap',margin:0 },
  // Test modal processing styles
  testProcessingBox: { display:'flex',flexDirection:'column',gap:24,padding:'16px 0' },
  testScanAnim:  { width:'100%',height:180,background:'#0a0a0a',borderRadius:'var(--radius-lg)',position:'relative',overflow:'hidden',border:'2px solid #1a1a2e' },
  testScanLine:  { position:'absolute',top:0,left:0,right:0,height:3,background:'rgba(123,92,250,0.8)',boxShadow:'0 0 12px rgba(123,92,250,0.6)',animation:'scanMove 2s ease-in-out infinite',zIndex:2 },
  testScanGrid:  { display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,padding:16,height:'100%',position:'relative' },
  testScanCell:  { background:'rgba(123,92,250,0.15)',borderRadius:4,border:'1px solid rgba(123,92,250,0.2)',transition:'opacity 0.3s' },
  testProgressWrap:  { display:'flex',flexDirection:'column',gap:8 },
  testProgressLabel: { display:'flex',justifyContent:'space-between',alignItems:'center' },
  testProgressBar:   { height:12,background:'var(--purple-pale)',borderRadius:99,overflow:'hidden' },
  testProgressFill:  { height:'100%',background:'linear-gradient(90deg,#7B5CFA,#A78BFA)',borderRadius:99,transition:'width 0.2s linear',boxShadow:'0 0 8px rgba(123,92,250,0.4)' },
  testReportBox:     { background:'#F8F9FA',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'20px 24px',display:'flex',flexDirection:'column',gap:10 },
  testReportHeader:  { fontFamily:'var(--font-head)',fontWeight:800,fontSize:15,color:'var(--text-dark)' },
  testReportText:    { fontSize:14,lineHeight:1.7,color:'var(--text-mid)',fontFamily:'monospace' },
  progressBox: { display:'flex',flexDirection:'column',gap:6,background:'var(--purple-ultra)',borderRadius:'var(--radius-md)',padding:'10px 12px',border:'1px solid var(--purple-pale)' },
  progressLabel: { display:'flex',justifyContent:'space-between',alignItems:'center' },
  progressBar: { height:8,background:'var(--purple-pale)',borderRadius:99,overflow:'hidden' },
  progressFill: { height:'100%',background:'var(--purple-primary)',borderRadius:99,transition:'width 0.4s ease' },
  submitBtn: { width:'100%',justifyContent:'center',letterSpacing:'0.5px',marginTop:'auto',padding:'12px' },
  overlay:   { position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:24 },
  examModal: { background:'#fff',borderRadius:'var(--radius-xl)',padding:'28px 32px',maxWidth:740,width:'100%',maxHeight:'92vh',overflow:'auto',display:'flex',flexDirection:'column',gap:18,boxShadow:'0 24px 80px rgba(0,0,0,0.3)' },
  examHeader: { display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16 },
  examDept:  { fontSize:12,fontWeight:700,color:'var(--purple-primary)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4 },
  examTitle: { fontFamily:'var(--font-head)',fontSize:22,fontWeight:800,color:'var(--text-dark)',lineHeight:1.2 },
  examDesc:  { color:'var(--text-mid)',fontSize:14,marginTop:6,lineHeight:1.6,maxWidth:580 },
  closeBtn:  { width:36,height:36,background:'var(--bg-main)',border:'none',borderRadius:'50%',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--text-mid)',fontWeight:700 },
  imgBox:    { borderRadius:'var(--radius-lg)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',minHeight:300,background:'#f0f0f0',border:'1px solid var(--border)' },
  examImg:   { width:'100%',maxHeight:480,objectFit:'contain',display:'block' },
  imgFallback: { flexDirection:'column',alignItems:'center',gap:12,padding:40,textAlign:'center' },
  examFooter: { display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:4 },
  recorded:  { fontSize:13,color:'var(--green)',fontWeight:700,fontFamily:'var(--font-head)' },
  submitModal: { background:'#fff',borderRadius:'var(--radius-xl)',padding:'32px',maxWidth:620,width:'100%',maxHeight:'90vh',overflow:'auto',display:'flex',flexDirection:'column',gap:16 },
  modalTitle: { fontFamily:'var(--font-head)',fontSize:22,fontWeight:800,color:'var(--text-dark)' },
  modalSub:  { color:'var(--text-mid)',fontSize:14,marginTop:-8 },
  fieldLabel: { fontSize:13,fontWeight:600,color:'var(--text-mid)',fontFamily:'var(--font-head)' },
  drugRow:   { display:'flex',gap:8,marginBottom:8 },
  addDrug:   { border:'2px dashed var(--border)',background:'transparent',borderRadius:'var(--radius-sm)',padding:'7px 14px',fontSize:13,color:'var(--purple-primary)',fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)',alignSelf:'flex-start' },
  modalBtns: { display:'flex',gap:12,justifyContent:'flex-end',marginTop:8 },
};
