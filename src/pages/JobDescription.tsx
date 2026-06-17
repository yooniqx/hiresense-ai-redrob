import { AppLayout } from "@/components/AppLayout";
import { SectionHeader } from "@/components/ui-kit";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Clock, CheckCircle2, Award, Gift } from "lucide-react";

export default function JobDescription() {
  const { data: jobDesc, isLoading, error } = useQuery({
    queryKey: ['job-description'],
    queryFn: api.getJobDescription,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading job description...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Error loading job description: {(error as Error).message}</p>
        </div>
      </AppLayout>
    );
  }

  if (!jobDesc) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No job description available</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SectionHeader
        title={jobDesc.title}
        description="Job requirements and details"
      />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{jobDesc.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{jobDesc.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{jobDesc.type}</span>
              </div>
            </div>
            <h3 className="font-display font-bold text-lg mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{jobDesc.description}</p>
          </div>

          {/* Responsibilities */}
          {jobDesc.responsibilities && jobDesc.responsibilities.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                Key Responsibilities
              </h3>
              <ul className="space-y-3">
                {jobDesc.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {jobDesc.benefits && jobDesc.benefits.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-accent" />
                Benefits
              </h3>
              <ul className="space-y-3">
                {jobDesc.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requirements */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Requirements
            </h3>
            
            <div className="space-y-4">
              {jobDesc.requirements?.required_skills && jobDesc.requirements.required_skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobDesc.requirements.required_skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs border border-accent/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {jobDesc.requirements?.preferred_skills && jobDesc.requirements.preferred_skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobDesc.requirements.preferred_skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md bg-surface-2 text-muted-foreground text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {jobDesc.requirements?.min_experience && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Experience</h4>
                  <p className="text-sm text-muted-foreground">
                    Minimum {jobDesc.requirements.min_experience} years
                  </p>
                </div>
              )}

              {jobDesc.requirements?.education && jobDesc.requirements.education.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Education</h4>
                  <ul className="space-y-1">
                    {jobDesc.requirements.education.map((edu, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-accent" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Made with Bob
