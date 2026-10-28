import React, { createContext, useContext, useState, useEffect } from 'react';
import resumeApi from '../api/resumeApi';
import { useAuth } from './AuthContext';
import SHRAWAN_PROFILE_IMAGE_URI from '../constants/shrawanProfileImage';

const ResumeContext = createContext(null);

const DEFAULT_RESUME_STATE = {
  title: 'Senior Software Engineer Resume',
  templateId: 'modern',
  paletteId: 'navy',
  customColor: null,
  personalInfo: {
    fullName: 'Shrawan Kr Yadav',
    jobTitle: 'Senior Full-Stack & Mobile Engineer',
    email: 'shrawan.yadav@skydevx.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/shrawan-kr-yadav',
    website: 'https://skydevx.com/shrawan',
    photoUrl: SHRAWAN_PROFILE_IMAGE_URI,
  },
  summary:
    'Innovative Senior Full-Stack Engineer and Mobile Architect with deep expertise in scalable React Native ecosystems and high-performance Spring Boot microservices. Proven success leading end-to-end product lifecycles, boosting operational throughput by 45%, and architecting enterprise-grade digital experiences.',
  experiences: [
    {
      id: 'exp_1',
      jobTitle: 'Lead Software Architect',
      company: 'sky.devX Innovations',
      location: 'Bengaluru, India',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Spearheaded architecture of high-scale mobile applications using React Native and Java 21 Spring Boot serving 100k+ monthly active users.',
        'Engineered responsive real-time ATS resume rendering engines with instant PDF vector export.',
        'Implemented enterprise-grade JWT token security, AES encryption, and automated CI/CD deployments.',
      ],
    },
    {
      id: 'exp_2',
      jobTitle: 'Senior Full Stack Developer',
      company: 'NextGen Digital Systems',
      location: 'Bengaluru, India',
      startDate: '2019',
      endDate: '2022',
      isCurrent: false,
      bullets: [
        'Developed fault-tolerant REST and WebSocket microservices with MongoDB Atlas and Redis caching.',
        'Redesigned core mobile UI workflows resulting in a 42% increase in user retention and engagement.',
      ],
    },
  ],
  educations: [
    {
      id: 'edu_1',
      school: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      startDate: '2015',
      endDate: '2019',
      bullets: [
        'Graduated with First Class Honors and Distinction.',
        'Lead organizer for National Technical Symposium and Hackathon.',
      ],
    },
  ],
  skills: [
    'React Native',
    'JavaScript / TypeScript',
    'Java 21 & Spring Boot 3',
    'MongoDB Atlas',
    'RESTful APIs',
    'System Architecture',
    'Microservices',
    'Docker & CI/CD',
    'ATS Optimization',
    'UI/UX Design Systems',
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Resume Genie — AI Resume Platform',
      link: 'https://skydevx.com/resume-genie',
      description:
        'Advanced mobile and web resume engineering system built with React Native Expo and Spring Boot 3.3. Featuring instant ATS formatting, multi-palette styling, and live preview.',
      bullets: [
        'Designed complete 7-step guided mobile workflow with live responsive document preview.',
        'Architected native dark and light mode adaptation complying with user system preferences.',
      ],
    },
  ],
};

export const ResumeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(DEFAULT_RESUME_STATE);
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadResumes();
    } else {
      setResumes([]);
    }
  }, [isAuthenticated, user?.id, user?.isDemoMode]);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      if (user?.isDemoMode) {
        setResumes([
          {
            id: 'resume_shrawan_demo_1',
            title: 'Lead Software Architect Resume (Demo)',
            templateId: 'modern',
            updatedAt: new Date().toISOString(),
            ...DEFAULT_RESUME_STATE,
          },
        ]);
        return;
      }

      // Real user: fetch private saved resumes from database
      const data = await resumeApi.getAllResumes();
      const rawList = Array.isArray(data) ? data : (data?.data || []);
      const formatted = rawList.map((r) => ({
        id: r.id || r._id,
        title: r.title,
        templateId: r.template?.templateId || r.templateId || 'modern',
        paletteId: r.template?.paletteId || r.paletteId || 'navy',
        customColor: r.template?.customColor || null,
        personalInfo: {
          fullName: r.profileInfo?.fullName || '',
          jobTitle: r.profileInfo?.designation || '',
          email: r.contactInfo?.email || '',
          phone: r.contactInfo?.phone || '',
          location: r.contactInfo?.location || '',
          linkedin: r.contactInfo?.linkedin || '',
          website: r.contactInfo?.website || '',
        },
        summary: r.profileInfo?.summary || '',
        experiences: (r.workExperience || []).map((we, idx) => ({
          id: `exp_${idx}`,
          company: we.company || '',
          jobTitle: we.role || '',
          startDate: we.startDate || '',
          endDate: we.endDate || '',
          isCurrent: !!we.current,
          bullets: we.description ? we.description.split('\n') : [],
        })),
        educations: (r.education || []).map((ed, idx) => ({
          id: `edu_${idx}`,
          school: ed.institution || '',
          degree: ed.degree || '',
          field: ed.fieldOfStudy || '',
          startDate: ed.startDate || '',
          endDate: ed.endDate || '',
          gpa: ed.grade || '',
        })),
        skills: (r.skills || []).map((sk) => (typeof sk === 'object' ? (sk.name || '') : sk)),
        projects: (r.projects || []).map((pr, idx) => ({
          id: `proj_${idx}`,
          title: pr.name || '',
          tech: pr.technologies || [],
          link: pr.link || '',
          bullets: pr.description ? pr.description.split('\n') : [],
        })),
      }));
      setResumes(formatted);
    } catch (err) {
      console.warn('[ResumeContext] Failed to load resumes:', err.message);
      if (user?.isDemoMode) {
        setResumes([
          {
            id: 'resume_shrawan_demo_1',
            title: 'Lead Software Architect Resume (Demo)',
            templateId: 'modern',
            updatedAt: new Date().toISOString(),
            ...DEFAULT_RESUME_STATE,
          },
        ]);
      } else {
        setResumes([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setCurrentResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateSummary = (summaryText) => {
    setCurrentResume((prev) => ({
      ...prev,
      summary: summaryText,
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [''],
    };
    setCurrentResume((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp],
    }));
  };

  const updateExperience = (id, field, value) => {
    setCurrentResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id) => {
    setCurrentResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const addExperienceBullet = (expId) => {
    setCurrentResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      ),
    }));
  };

  const updateExperienceBullet = (expId, index, text) => {
    setCurrentResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          const newBullets = [...exp.bullets];
          newBullets[index] = text;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      }),
    }));
  };

  const removeExperienceBullet = (expId, index) => {
    setCurrentResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          const newBullets = exp.bullets.filter((_, i) => i !== index);
          return { ...exp, bullets: newBullets };
        }
        return exp;
      }),
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: `edu_${Date.now()}`,
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    };
    setCurrentResume((prev) => ({
      ...prev,
      educations: [...(prev.educations || []), newEdu],
    }));
  };

  const updateEducation = (id, field, value) => {
    setCurrentResume((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id) => {
    setCurrentResume((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id),
    }));
  };

  const addEducationBullet = (eduId) => {
    setCurrentResume((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) =>
        edu.id === eduId ? { ...edu, bullets: [...edu.bullets, ''] } : edu
      ),
    }));
  };

  const updateEducationBullet = (eduId, index, text) => {
    setCurrentResume((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) => {
        if (edu.id === eduId) {
          const newBullets = [...edu.bullets];
          newBullets[index] = text;
          return { ...edu, bullets: newBullets };
        }
        return edu;
      }),
    }));
  };

  const removeEducationBullet = (eduId, index) => {
    setCurrentResume((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) => {
        if (edu.id === eduId) {
          const newBullets = edu.bullets.filter((_, i) => i !== index);
          return { ...edu, bullets: newBullets };
        }
        return edu;
      }),
    }));
  };

  const addSkill = (skillName) => {
    if (!skillName || !skillName.trim()) return;
    const trimmed = skillName.trim();
    if (currentResume.skills?.includes(trimmed)) return;
    setCurrentResume((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), trimmed],
    }));
  };

  const removeSkill = (skillName) => {
    setCurrentResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillName),
    }));
  };

  const addProject = () => {
    const newProj = {
      id: `proj_${Date.now()}`,
      title: '',
      link: '',
      description: '',
      bullets: [''],
    };
    setCurrentResume((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProj],
    }));
  };

  const updateProject = (id, field, value) => {
    setCurrentResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removeProject = (id) => {
    setCurrentResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const addProjectBullet = (projId) => {
    setCurrentResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projId ? { ...p, bullets: [...p.bullets, ''] } : p
      ),
    }));
  };

  const updateProjectBullet = (projId, index, text) => {
    setCurrentResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projId) {
          const newBullets = [...p.bullets];
          newBullets[index] = text;
          return { ...p, bullets: newBullets };
        }
        return p;
      }),
    }));
  };

  const removeProjectBullet = (projId, index) => {
    setCurrentResume((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projId) {
          const newBullets = p.bullets.filter((_, i) => i !== index);
          return { ...p, bullets: newBullets };
        }
        return p;
      }),
    }));
  };

  const setTemplate = (templateId) => {
    setCurrentResume((prev) => ({
      ...prev,
      templateId,
    }));
  };

  const setPalette = (paletteId, customHex = null) => {
    setCurrentResume((prev) => ({
      ...prev,
      paletteId,
      customColor: customHex,
    }));
  };

  const saveCurrentResume = async () => {
    setIsSaving(true);
    try {
      const title = currentResume.title || (currentResume.personalInfo?.fullName
        ? `${currentResume.personalInfo?.fullName}'s Resume`
        : 'Professional Resume');

      const backendPayload = {
        title,
        template: {
          templateId: currentResume.templateId || 'modern',
          paletteId: currentResume.paletteId || 'navy',
          customColor: currentResume.customColor || null,
        },
        profileInfo: {
          fullName: currentResume.personalInfo?.fullName || '',
          designation: currentResume.personalInfo?.jobTitle || '',
          summary: currentResume.summary || '',
        },
        contactInfo: {
          email: currentResume.personalInfo?.email || '',
          phone: currentResume.personalInfo?.phone || '',
          location: currentResume.personalInfo?.location || '',
          linkedin: currentResume.personalInfo?.linkedin || '',
          website: currentResume.personalInfo?.website || '',
        },
        workExperience: (currentResume.experiences || []).map((e) => ({
          company: e.company || '',
          role: e.jobTitle || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          current: !!e.isCurrent,
          description: Array.isArray(e.bullets) ? e.bullets.join('\n') : (e.description || ''),
        })),
        education: (currentResume.educations || []).map((ed) => ({
          institution: ed.school || '',
          degree: ed.degree || '',
          fieldOfStudy: ed.field || '',
          startDate: ed.startDate || '',
          endDate: ed.endDate || '',
          grade: ed.gpa || '',
        })),
        skills: (currentResume.skills || []).map((s) => ({
          name: typeof s === 'string' ? s : (s.name || ''),
          level: typeof s === 'object' && s.level ? s.level : 'Advanced',
        })),
        projects: (currentResume.projects || []).map((p) => ({
          name: p.title || '',
          description: Array.isArray(p.bullets) ? p.bullets.join('\n') : (p.description || ''),
          technologies: Array.isArray(p.tech) ? p.tech : [],
          link: p.link || '',
        })),
      };

      let resumeId = currentResume.id;
      if (!resumeId) {
        const created = await resumeApi.createResume({ title });
        const createdObj = created?.data || created;
        resumeId = createdObj.id || createdObj._id;
        setCurrentResume((prev) => ({ ...prev, id: resumeId }));
      }

      if (resumeId) {
        await resumeApi.updateResume(resumeId, backendPayload);
        await loadResumes();
      }
      setLastSaved(new Date());
    } catch (err) {
      console.warn('[ResumeContext] Save error:', err);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const startNewResume = (templateId = 'modern') => {
    const isDemo = user?.isDemoMode;
    const initialName = isDemo ? 'Shrawan Kr Yadav' : (user?.name || user?.fullName || '');
    const initialEmail = isDemo ? 'shrawan.yadav@skydevx.com' : (user?.email || '');

    setCurrentResume({
      title: initialName ? `${initialName}'s Resume` : 'Untitled Resume',
      templateId: templateId || 'modern',
      paletteId: 'navy',
      customColor: null,
      personalInfo: {
        fullName: initialName,
        jobTitle: '',
        email: initialEmail,
        phone: '',
        location: '',
        linkedin: '',
        website: '',
      },
      summary: '',
      experiences: [],
      educations: [],
      skills: [],
      projects: [],
    });
    setActiveStep(1);
  };

  const deleteResume = async (id) => {
    try {
      await resumeApi.deleteResume(id);
    } catch (e) {
      console.warn('API delete error:', e);
    }
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        activeStep,
        isLoading,
        isSaving,
        lastSaved,
        setActiveStep,
        setCurrentResume,
        updatePersonalInfo,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addExperienceBullet,
        updateExperienceBullet,
        removeExperienceBullet,
        addEducation,
        updateEducation,
        removeEducation,
        addEducationBullet,
        updateEducationBullet,
        removeEducationBullet,
        addSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addProjectBullet,
        updateProjectBullet,
        removeProjectBullet,
        setTemplate,
        setPalette,
        saveCurrentResume,
        startNewResume,
        deleteResume,
        loadResumes,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export default ResumeContext;
