import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Target, Zap, ArrowRight, Calendar } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/register')
    }

    const handleLogin = () => {
        navigate('/login')
    }

    const features = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Stay Organized",
            description: "Keep all your tasks in one place with intuitive organization and smart categorization."
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Real-Time Tracking",
            description: "Live countdown timers and deadline notifications keep you on track and productive."
        },
        {
            icon: <CheckCircle2 className="w-8 h-8" />,
            title: "Track Progress",
            description: "Visual indicators and statistics help you monitor your productivity at a glance."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Instant updates and responsive interface ensure smooth workflow without delays."
        }
    ]

    return (
        <div className="min-h-screen bg-[#222831] text-[#EEEEEE] overflow-x-hidden">
            {/* Navigation */}
            <nav className="border-b border-[#393E46] bg-[#222831]/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-[#00ADB5]" />
                        <h1 className="text-2xl font-bold text-[#EEEEEE]">TaskFlow</h1>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleLogin}
                        className="bg-[#393E46] text-[#EEEEEE] hover:text-[#00ADB5] hover:bg-[#393E46]"
                    >
                        Sign In
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative px-6 py-20 md:py-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#393E46] border border-[#00ADB5]/20">
                            <Zap className="w-4 h-4 text-[#00ADB5]" />
                            <span className="text-sm text-[#EEEEEE]">Smart Task Management</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                            Organize Your Tasks,
                            <br />
                            <span className="text-[#00ADB5]">Achieve Your Goals</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-[#EEEEEE]/70 max-w-2xl mx-auto leading-relaxed">
                            A powerful yet simple task manager with real-time deadlines, priority tracking, and beautiful design.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                                size="lg"
                                onClick={handleGetStarted}
                                className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-[#00ADB5]/30 transition-all duration-300 group"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleLogin}
                                className="border-2 border-[#393E46] hover:border-[#00ADB5] text-[#EEEEEE] hover:bg-[#393E46] px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                            >
                                Sign In
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-8 flex items-center justify-center gap-8 text-sm text-[#EEEEEE]/50">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#00ADB5]" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#00ADB5]" />
                                <span>Free forever</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative px-6 py-20 bg-[#393E46]/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#EEEEEE]">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-[#EEEEEE]/60 max-w-2xl mx-auto">
                            Powerful features designed to boost your productivity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-[#393E46] border border-[#393E46] hover:border-[#00ADB5] transition-all duration-300 hover:shadow-lg hover:shadow-[#00ADB5]/10"
                            >
                                <div className="w-16 h-16 rounded-xl bg-[#00ADB5]/10 flex items-center justify-center mb-4 group-hover:bg-[#00ADB5]/20 transition-colors">
                                    <div className="text-[#00ADB5]">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-[#EEEEEE] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[#EEEEEE]/60 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-5xl font-bold text-[#00ADB5]">Fast</div>
                            <p className="text-[#EEEEEE]/60">Lightning-quick performance</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-bold text-[#00ADB5]">Simple</div>
                            <p className="text-[#EEEEEE]/60">Intuitive and easy to use</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-5xl font-bold text-[#00ADB5]">Free</div>
                            <p className="text-[#EEEEEE]/60">No hidden costs, forever</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative px-6 py-20 bg-[#393E46]/20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#EEEEEE]">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-[#EEEEEE]/60">
                        Join thousands of productive people managing their tasks efficiently
                    </p>
                    <Button
                        size="lg"
                        onClick={handleGetStarted}
                        className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-[#00ADB5]/30 transition-all duration-300"
                    >
                        Start For Free
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#393E46] px-6 py-8">
                <div className="max-w-7xl mx-auto text-center text-[#EEEEEE]/40 text-sm">
                    <p>© 2024 TaskFlow. Built with ❤️ for productivity.</p>
                </div>
            </footer>
        </div>
    )
}