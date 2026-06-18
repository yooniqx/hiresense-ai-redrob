import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/AppLayout';
import { SectionHeader, PrimaryButton, GhostButton } from '@/components/ui-kit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Skill {
  name: string;
  proficiency: string;
}

export default function AddCandidate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    summary: '',
    location: '',
    country: 'India',
    years_of_experience: '',
    current_title: '',
    current_company: '',
    company_size: '',
    industry: '',
    education_degree: '',
    education_institution: '',
    education_field: '',
    availability: 'Immediate',
  });
  const [skills, setSkills] = useState<Skill[]>([{ name: '', proficiency: 'Expert' }]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', proficiency: 'Expert' }]);
  };

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter candidate name');
      return;
    }
    if (!formData.headline.trim()) {
      toast.error('Please enter professional headline');
      return;
    }
    if (!formData.years_of_experience) {
      toast.error('Please enter years of experience');
      return;
    }

    const validSkills = skills.filter(s => s.name.trim());
    if (validSkills.length < 3) {
      toast.error('Please add at least 3 skills');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare candidate data in backend expected format
      const candidateData = {
        profile: {
          name: formData.name.trim(),
          headline: formData.headline.trim(),
          summary: formData.summary.trim() || `${formData.headline} with ${formData.years_of_experience} years of experience`,
          location: formData.location.trim() || 'India',
          country: formData.country,
          years_of_experience: parseFloat(formData.years_of_experience),
          current_title: formData.current_title.trim() || formData.headline.trim(),
          current_company: formData.current_company.trim() || 'Not specified',
          company_size: formData.company_size || '1000-5000',
          industry: formData.industry.trim() || 'Technology',
          availability: formData.availability,
          expected_ctc: 2000000,
          notice_period_days: 30,
        },
        skills: validSkills.map(s => ({
          name: s.name.trim(),
          proficiency: s.proficiency,
          endorsements: 0,
          duration_months: 12,
        })),
        education: [{
          institution: formData.education_institution.trim() || 'University',
          degree: formData.education_degree.trim() || 'Bachelor',
          field_of_study: formData.education_field.trim() || 'Computer Science',
          start_year: 2015,
          end_year: 2019,
          tier: 'Tier 1',
        }],
        career_history: [{
          company: formData.current_company.trim() || 'Current Company',
          title: formData.current_title.trim() || formData.headline.trim(),
          duration_months: Math.floor(parseFloat(formData.years_of_experience) * 12),
          description: formData.summary.trim() || 'Professional experience',
        }],
        certifications: [],
        languages: ['English'],
        redrob_signals: {
          last_active_date: new Date().toISOString().split('T')[0],
          profile_completeness: 85,
          response_rate: 90,
          job_search_status: 'actively_looking',
        },
      };

      const result = await api.addCandidate(candidateData);

      if (result.success) {
        // Invalidate candidates query to force refetch
        await queryClient.invalidateQueries({ queryKey: ['candidates'] });
        
        toast.success(
          `Candidate Added Successfully! Score: ${result.score} | Rank: #${result.rank} of ${result.total_candidates}`,
          { duration: 3000 }
        );
        
        // Navigate to candidates page after short delay
        setTimeout(() => {
          navigate('/candidates');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error('Failed to add candidate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Add New Candidate"
          description="Enter candidate details to analyze and rank them using AI"
        />

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Profile Information */}
          <div className="glass rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-ember grid place-items-center">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
              Profile Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="headline">Professional Headline *</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  placeholder="Senior ML Engineer | AI Specialist"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Experienced ML engineer with expertise in..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Bangalore, Karnataka"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="India"
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="glass rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years_of_experience">Years of Experience *</Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  step="0.5"
                  value={formData.years_of_experience}
                  onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
                  placeholder="5.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="current_title">Current Title</Label>
                <Input
                  id="current_title"
                  value={formData.current_title}
                  onChange={(e) => handleInputChange('current_title', e.target.value)}
                  placeholder="Senior ML Engineer"
                />
              </div>

              <div>
                <Label htmlFor="current_company">Current Company</Label>
                <Input
                  id="current_company"
                  value={formData.current_company}
                  onChange={(e) => handleInputChange('current_company', e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>

              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Select value={formData.company_size} onValueChange={(value) => handleInputChange('company_size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-1000">201-1000</SelectItem>
                    <SelectItem value="1000-5000">1000-5000</SelectItem>
                    <SelectItem value="5000+">5000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="Technology"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Skills (Add at least 3 AI/ML skills)</h3>
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-surface border border-border text-foreground font-medium text-sm hover:border-accent/50 hover:bg-surface-2 transition"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </button>
            </div>

            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      placeholder="e.g., Python, TensorFlow, PyTorch"
                    />
                  </div>
                  <div className="w-40">
                    <Select value={skill.proficiency} onValueChange={(value) => updateSkill(index, 'proficiency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Expert">Expert</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="glass rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Education</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education_institution">Institution</Label>
                <Input
                  id="education_institution"
                  value={formData.education_institution}
                  onChange={(e) => handleInputChange('education_institution', e.target.value)}
                  placeholder="IIT Bombay"
                />
              </div>

              <div>
                <Label htmlFor="education_degree">Degree</Label>
                <Input
                  id="education_degree"
                  value={formData.education_degree}
                  onChange={(e) => handleInputChange('education_degree', e.target.value)}
                  placeholder="B.Tech"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="education_field">Field of Study</Label>
                <Input
                  id="education_field"
                  value={formData.education_field}
                  onChange={(e) => handleInputChange('education_field', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="glass rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Availability</h3>
            
            <div>
              <Label htmlFor="availability">Notice Period</Label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="15 days">15 days</SelectItem>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="60 days">60 days</SelectItem>
                  <SelectItem value="90 days">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/candidates')}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-surface border border-border text-foreground font-medium text-sm hover:border-accent/50 hover:bg-surface-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 h-10 px-6 rounded-lg gradient-ember text-white font-medium text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Add Candidate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

// Made with Bob
