'use client'

import { BookOpenCheck } from 'lucide-react';
import Card from "@/components/Card";
import {useState} from "react";
import { toast } from "sonner";
import {ModeToggle} from "@/components/ModeToggle";

export default function Home() {
    const [email, setEmail] = useState('');

    const handleSubscribe = () => {
        fetch("/api/subscribe", {
            method: "POST",
            body: JSON.stringify({ email }),
        }).then(res => res.json()).then(data => {
            if (data.error) {
                console.log(data.error);
                toast.error(data.error);
            } else {
                toast.success("Subscribed successfully!");
            }
        }).catch(error => {
            console.log(error);
            toast.error(error);
        }).finally(() => {
            setEmail("");
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900">
            {/*header*/}
            <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <BookOpenCheck className="text-black dark:text-white" />
                    <h1 className="text-2xl font-bold">Daily News</h1>
                </div>
                <nav className="flex items-center gap-6">
                    <a href="#" className="hover:text-gray-500">About</a>
                    <a href="#" className="hover:text-gray-500">Contact</a>
                    <ModeToggle />
                </nav>
            </header>

            {/*main content*/}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/*title*/}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6">Daily Brief of AI</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-50 max-w-3xl mx-auto leading-relaxed">
                        Discover the latest news and insights in the world of AI. Stay updated with the latest developments and trends in artificial intelligence.
                    </p>
                </div>

                {/*input and subscribe button*/}
                <div className="flex justify-center items-center gap-4">
                    <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Enter your email" className="w-full max-w-md p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-950"/>
                    <button onClick={handleSubscribe} className="bg-blue-600 text-white dark:text-gray-100 px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors">Subscribe</button>
                </div>

                {/*cards*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    <Card title="AI" description="Latest news and insights in the world of AI. Stay updated with the latest developments and trends in artificial intelligence."></Card>
                    <Card title="Startup" description="Bussiness news and insights in the world of startups. Stay updated with the latest developments and trends in startups."></Card>
                    <Card title="Tech" description="Latest news and insights in the world of tech. Stay updated with the latest developments and trends in tech."></Card>
                </div>
            </div>
        </div>
    );
}
