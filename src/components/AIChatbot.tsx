'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import styles from './AIChatbot.module.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

let msgIdCounter = 0;
function generateId(): string {
    return `msg-${Date.now()}-${++msgIdCounter}`;
}

// ── Comprehensive keyword-based response system ──
const QA_DATA: { keywords: string[]; response: string }[] = [
    {
        keywords: ['who', 'about', 'yourself', 'introduce', 'tell me', 'lakshya'],
        response: "I'm Lakshya Purohit — a Software Developer & System Architect from Jaipur, India 🇮🇳. I specialize in building scalable backend systems, real-time applications, and enterprise-grade solutions. I love turning complex problems into elegant, maintainable code."
    },
    {
        keywords: ['skill', 'technolog', 'stack', 'tools', 'language', 'framework', 'what do you know'],
        response: "My core tech stack includes:\n\n🔹 Backend: ASP.NET Core, Node.js, Python, Flask\n🔹 Frontend: Angular, React, Next.js, TypeScript\n🔹 Databases: PostgreSQL, SQL Server, MongoDB\n🔹 DevOps: Docker, Kubernetes, CI/CD\n🔹 Real-time: WebRTC, SignalR, WebSockets\n🔹 AI/ML: Computer Vision, OCR, Gemini API\n🔹 Other: Microservices, Event-Driven Architecture, Redis"
    },
    {
        keywords: ['experience', 'work', 'job', 'company', 'career', 'worked'],
        response: "I've worked on enterprise-level projects including:\n\n💼 Building real-time video communication platforms using WebRTC\n💼 Designing microservices architecture for scalable backend systems\n💼 Developing computer vision & OCR solutions for document processing\n💼 Creating database version control tools for team collaboration\n💼 Building full-stack web applications with Angular + ASP.NET Core"
    },
    {
        keywords: ['project', 'built', 'made', 'created', 'portfolio', 'showcase'],
        response: "Some of my notable projects:\n\n🚀 Real-time Video Platform — WebRTC-based video calling with screen sharing\n🚀 Database Version Control — Tool for managing DB schema changes across teams\n🚀 OCR Document Processor — Computer vision pipeline for extracting text from documents\n🚀 This Portfolio — Built with Next.js, GSAP animations, and glassmorphic design\n🚀 Enterprise Backend Systems — Microservices with ASP.NET Core + PostgreSQL"
    },
    {
        keywords: ['education', 'study', 'college', 'university', 'degree', 'school'],
        response: "I hold a degree in Computer Science/Engineering. My education provided a strong foundation in algorithms, data structures, and software engineering principles, which I've continuously built upon through hands-on project experience and self-learning."
    },
    {
        keywords: ['contact', 'reach', 'email', 'mail', 'phone', 'connect', 'hire'],
        response: "You can reach me at:\n\n📧 Email: lakshya.purohit.2105@gmail.com\n🔗 LinkedIn: linkedin.com/in/lakshyapurohit\n🐙 GitHub: github.com/lakshyapurohit\n📍 Location: Jaipur, Rajasthan, India\n\nFeel free to reach out for collaborations, freelance work, or just to chat about tech!"
    },
    {
        keywords: ['location', 'where', 'city', 'country', 'based', 'live'],
        response: "I'm based in Jaipur, Rajasthan, India 🇮🇳 — the Pink City! I work with clients and teams globally, and I'm open to remote opportunities worldwide."
    },
    {
        keywords: ['ai', 'artificial', 'machine learning', 'ml', 'deep learning', 'gemini', 'gpt'],
        response: "I actively integrate AI into my work:\n\n🤖 Built OCR solutions using Computer Vision for document processing\n🤖 Implemented AI-powered chatbots using Gemini API\n🤖 Experience with ML pipelines for data analysis\n🤖 Exploring generative AI for code assistance and automation\n🤖 This chatbot itself demonstrates my AI integration skills!"
    },
    {
        keywords: ['hobby', 'hobbies', 'interest', 'free time', 'fun', 'passion'],
        response: "When I'm not coding, I enjoy:\n\n🎮 Exploring new technologies and building side projects\n📚 Reading about system design and architecture patterns\n🎯 Contributing to open-source projects\n☕ Great coffee and deep tech discussions\n🌍 Learning about different cultures through their languages"
    },
    {
        keywords: ['certif', 'certificate', 'credential', 'badge'],
        response: "I hold certifications in various technologies including cloud platforms, database management, and software development methodologies. These certifications validate my expertise and commitment to continuous learning in the tech industry."
    },
    {
        keywords: ['resume', 'cv', 'download', 'pdf'],
        response: "You can view my full experience and skills right here on this portfolio! For a formal resume/CV, feel free to email me at lakshya.purohit.2105@gmail.com and I'll send it over. You can also find my detailed work history on LinkedIn."
    },
    {
        keywords: ['available', 'freelance', 'open', 'work together', 'collaborate'],
        response: "Yes! I'm open to:\n\n✅ Full-time positions (remote/hybrid)\n✅ Freelance & contract work\n✅ Technical consulting\n✅ Open-source collaboration\n\nLet's build something amazing together! Reach out at lakshya.purohit.2105@gmail.com"
    },
    {
        keywords: ['webrtc', 'video', 'real-time', 'streaming', 'call'],
        response: "I have deep experience with WebRTC and real-time communication:\n\n📹 Built peer-to-peer video calling solutions\n📹 Implemented screen sharing and recording features\n📹 Designed signaling servers with WebSocket/SignalR\n📹 Optimized for low-latency, high-quality streams\n📹 Handled NAT traversal with TURN/STUN servers"
    },
    {
        keywords: ['backend', 'api', 'server', 'architecture', 'microservice', 'system design'],
        response: "Backend architecture is my forte:\n\n⚙️ Microservices with ASP.NET Core & Node.js\n⚙️ RESTful APIs with proper versioning and documentation\n⚙️ Event-driven architecture with message queues\n⚙️ Database optimization & query performance tuning\n⚙️ Containerization with Docker & orchestration with K8s\n⚙️ CI/CD pipelines for automated deployments"
    },
    {
        keywords: ['frontend', 'react', 'angular', 'next', 'ui', 'design'],
        response: "While I'm primarily a backend engineer, I'm skilled in frontend too:\n\n🎨 React & Next.js — this portfolio is proof!\n🎨 Angular — enterprise-grade SPAs\n🎨 TypeScript — type-safe frontend development\n🎨 CSS animations, GSAP, Framer Motion\n🎨 Responsive, accessible, and performant UIs"
    },
    {
        keywords: ['database', 'sql', 'postgres', 'mongo', 'data'],
        response: "I work extensively with databases:\n\n🗄️ PostgreSQL — my go-to for complex, relational data\n🗄️ SQL Server — enterprise environments\n🗄️ MongoDB — document-based NoSQL\n🗄️ Redis — caching and real-time data\n🗄️ Database version control tools (I built one!)\n🗄️ Query optimization & indexing strategies"
    },
    {
        keywords: ['docker', 'kubernetes', 'k8s', 'devops', 'deploy', 'cloud', 'ci', 'cd'],
        response: "I'm experienced in DevOps & cloud:\n\n☁️ Docker containerization for all my projects\n☁️ Kubernetes for orchestration\n☁️ CI/CD with GitHub Actions, Azure DevOps\n☁️ Cloud deployments (AWS, Azure)\n☁️ Infrastructure as Code\n☁️ Monitoring & logging best practices"
    },
    {
        keywords: ['python', 'flask', 'django', 'script'],
        response: "Python is one of my key tools:\n\n🐍 Flask for lightweight APIs and microservices\n🐍 Computer Vision pipelines with OpenCV\n🐍 Data processing & automation scripts\n🐍 OCR solutions using Tesseract + custom models\n🐍 Integration with AI/ML libraries"
    },
    {
        keywords: ['hello', 'hi', 'hey', 'morning', 'evening', 'afternoon', 'sup', 'greet'],
        response: "Hey there! 👋 Welcome to my portfolio! I'm here to tell you all about Lakshya's skills, projects, and experience. What would you like to know?"
    },
    {
        keywords: ['thank', 'thanks', 'awesome', 'great', 'nice', 'cool', 'good'],
        response: "Thank you! 😊 Glad I could help. If you have more questions about Lakshya's work, skills, or anything else, feel free to ask!"
    },
    {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'quit'],
        response: "See you later! 👋 Don't forget to check out the projects section and feel free to reach out via the contact section. Have a great day!"
    },
    {
        keywords: ['strength', 'best at', 'speciali', 'expert', 'strong'],
        response: "My key strengths:\n\n💪 Backend Architecture — designing systems that scale\n💪 Problem-solving — breaking down complex challenges\n💪 Real-time Systems — low-latency, high-throughput\n💪 Full-stack Thinking — understanding the whole picture\n💪 Quick Learner — adapting to new tech rapidly"
    },
    {
        keywords: ['rate', 'charge', 'cost', 'pricing', 'budget'],
        response: "My rates vary depending on the project scope, complexity, and timeline. I offer competitive pricing and flexible engagement models. Let's discuss your specific needs — email me at lakshya.purohit.2105@gmail.com for a detailed quote!"
    },
];

function findResponse(input: string): string {
    const lower = input.toLowerCase().trim();

    for (const qa of QA_DATA) {
        if (qa.keywords.some(kw => lower.includes(kw))) {
            return qa.response;
        }
    }

    return "Interesting question! While I might not have a specific answer for that, I can tell you about Lakshya's skills, projects, experience, AI work, or how to get in touch. What interests you? 🤔";
}

// Memoized message bubble
const MessageBubble = memo(function MessageBubble({ msg }: { msg: Message }) {
    return (
        <div className={`${styles.message} ${styles[msg.role]}`}>
            {msg.role === 'assistant' && (
                <div className={styles.avatar}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3 6.5V18a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z" />
                    </svg>
                </div>
            )}
            <div className={styles.bubble}>{msg.text}</div>
        </div>
    );
});

export default function AIChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: generateId(), role: 'assistant', text: "Hey! 👋 I'm Lakshya's assistant. Ask me about his projects, skills, experience, or anything else!" },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const sendMessage = useCallback(() => {
        const text = input.trim();
        if (!text) return;

        const userMsg: Message = { id: generateId(), role: 'user', text };
        const reply = findResponse(text);
        const botMsg: Message = { id: generateId(), role: 'assistant', text: reply };

        setMessages(prev => [...prev, userMsg, botMsg]);
        setInput('');
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating trigger button */}
            <button
                className={`${styles.trigger} ${open ? styles.triggerHidden : ''}`}
                onClick={() => setOpen(true)}
                aria-label="Open chatbot"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className={styles.triggerLabel}>Ask Me</span>
            </button>

            {/* Chat panel */}
            <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <div className={styles.headerDot} />
                        <div>
                            <div className={styles.headerTitle}>Lakshya&apos;s Assistant</div>
                            <div className={styles.headerSub}>Ask me anything</div>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.messages}>
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputArea}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about skills, projects, experience..."
                        className={styles.input}
                        maxLength={500}
                    />
                    <button
                        className={styles.sendBtn}
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        aria-label="Send message"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
