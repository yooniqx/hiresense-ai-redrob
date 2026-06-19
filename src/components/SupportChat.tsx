import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "hiresense-chat-history";

const getInitialMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load chat history:", error);
  }
  
  return [
    {
      role: "assistant",
      content: "Hi! I'm your HireSense AI assistant. I can help you with:\n\n• Finding candidate information\n• Understanding ranking scores\n• Explaining job requirements\n• Navigating the platform\n\nWhat would you like to know?",
    },
  ];
};

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [input, setInput] = useState("");

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [messages]);

  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: api.getCandidates,
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
  });

  const { data: jobDesc } = useQuery({
    queryKey: ['job-description'],
    queryFn: api.getJobDescription,
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Generate response based on user query
    const response = generateResponse(input.toLowerCase());
    const assistantMessage: Message = { role: "assistant", content: response };

    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput("");
  };

  const generateResponse = (query: string): string => {
    // Candidate queries
    if (query.includes("how many") && query.includes("candidate")) {
      return `We currently have ${stats?.totalCandidates || 0} total candidates in the system, with ${stats?.rankedCandidates || 0} candidates ranked and ready for review.`;
    }

    if (query.includes("top candidate") || query.includes("best candidate")) {
      const topCandidate = candidates[0];
      if (topCandidate) {
        return `The top candidate is **${topCandidate.name}** with a score of **${topCandidate.score}%**. They are a ${topCandidate.title} with ${topCandidate.yearsExperience} years of experience. You can view their full profile in the Candidates section.`;
      }
      return "No candidates have been ranked yet. Please run the ranking process first.";
    }

    if (query.includes("average score") || query.includes("avg score")) {
      return `The average match score across all ranked candidates is **${stats?.averageMatch || 0}%**. The top candidate scored **${stats?.topCandidate || 0}%**.`;
    }

    // Job description queries
    if (query.includes("job") && (query.includes("title") || query.includes("position"))) {
      return `We're hiring for the position of **${jobDesc?.title || "Senior Machine Learning Engineer"}**. This is a ${jobDesc?.type || "Full-time"} role in the ${jobDesc?.department || "Engineering"} department.`;
    }

    if (query.includes("required skill") || query.includes("requirements")) {
      const skills = jobDesc?.requirements?.required_skills || [];
      return `The required skills for this position include:\n\n${skills.slice(0, 8).map((s) => `• ${s}`).join("\n")}\n\nYou can view the complete job description in the Job Description section.`;
    }

    if (query.includes("experience") && query.includes("required")) {
      return `The minimum required experience for this role is **${jobDesc?.requirements?.min_experience || 5} years**. We're looking for candidates with strong expertise in machine learning and production systems.`;
    }

    // Analytics queries
    if (query.includes("top skill") || query.includes("common skill")) {
      const topSkills = analytics?.topSkills?.slice(0, 5) || [];
      if (topSkills.length > 0) {
        return `The most common skills among our top candidates are:\n\n${topSkills.map((s, i) => `${i + 1}. **${s.name}** (${s.count} candidates)`).join("\n")}`;
      }
      return "Analytics data is being processed. Please check back shortly.";
    }

    if (query.includes("score distribution") || query.includes("how many scored")) {
      const dist = analytics?.scoreDistribution || [];
      if (dist.length > 0) {
        return `Here's the score distribution:\n\n${dist.map((b) => `• **${b.range}** (${b.label}): ${b.count} candidates`).join("\n")}`;
      }
      return "Analytics data is being processed. Please check back shortly.";
    }

    // Navigation help
    if (query.includes("how") && (query.includes("view") || query.includes("see") || query.includes("find"))) {
      return `You can navigate through the platform using the sidebar:\n\n• **Dashboard**: Overview and key metrics\n• **Candidates**: Browse all ranked candidates\n• **Job Description**: View position requirements\n• **Ranking Results**: See detailed rankings\n• **Analytics**: View insights and trends\n\nUse the search bar at the top to quickly find specific candidates.`;
    }

    if (query.includes("rank") && query.includes("how")) {
      return `To rank candidates:\n\n1. Go to the **Ranking Results** page\n2. Click the **"Re-rank Candidates"** button\n3. The AI will analyze all candidates and generate rankings\n4. Results will appear automatically\n\nThe ranking considers skills match (40%), experience (30%), profile quality (20%), and behavioral signals (10%).`;
    }

    if (query.includes("search") || query.includes("filter")) {
      return `You can search for candidates using the search bar at the top of the page. Search by:\n\n• Candidate name\n• Job title/role\n• Skills\n• Location\n\nOn the Candidates page, you can also filter by recommendation level (Strong Hire, Hire, Maybe, Pass).`;
    }

    // Scoring explanation
    if (query.includes("score") && (query.includes("calculate") || query.includes("work") || query.includes("mean"))) {
      return `Candidate scores are calculated using our AI ranking algorithm:\n\n• **Skills Match (40%)**: How well their skills align with job requirements\n• **Experience Match (30%)**: Years of experience and relevance\n• **Profile Quality (20%)**: Completeness and presentation\n• **Behavioral Signals (10%)**: GitHub activity, contributions, etc.\n\nScores range from 0-100, with 85+ being "Strong Hire" candidates.`;
    }

    // Default responses
    const defaultResponses = [
      "I can help you with information about candidates, job requirements, rankings, and analytics. Try asking:\n\n• 'How many candidates do we have?'\n• 'Who is the top candidate?'\n• 'What are the required skills?'\n• 'How do I rank candidates?'\n• 'What are the top skills?'",
      "I'm here to help! You can ask me about:\n\n• Candidate information and scores\n• Job requirements and skills\n• How to use the platform\n• Analytics and insights\n\nWhat would you like to know?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative h-9 w-9 grid place-items-center rounded-lg bg-surface border border-border hover:border-accent/50 transition group"
      >
        <MessageCircle className="h-4 w-4 group-hover:text-accent transition" />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px] shadow-accent animate-pulse" />
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed top-20 right-4 z-50 w-full max-w-md">
          <div className="w-full h-[600px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-ember grid place-items-center glow-ember">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold">HireSense Assistant</h3>
                  <p className="text-xs text-muted-foreground">Ask me anything about your candidates</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-surface transition grid place-items-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-primary to-accent text-white"
                        : "bg-surface border border-border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-surface/50">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 h-10 px-4 rounded-lg bg-background border border-border focus:border-accent/50 outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-10 w-10 rounded-lg gradient-ember grid place-items-center disabled:opacity-50 disabled:cursor-not-allowed hover:glow-ember transition"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
