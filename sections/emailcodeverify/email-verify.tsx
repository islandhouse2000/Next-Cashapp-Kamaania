'use client'

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';


interface UserData {
    code: string,
    email: string | null,
    verifystatus: string,
}

const verifyEmail = localStorage.getItem('verifyemail');
const userEmail = verifyEmail ? JSON.parse(verifyEmail) : {};

export default function EmailCodeVerifyPage() {

    const router = useRouter();
    const [emailcode, setEmailCode] = useState("");

    const userData: UserData = {
        code: emailcode,
        email: userEmail,
        verifystatus: "yes",
    }

    const onSubmit = async (userData: UserData) => {
        try {
            const response = await fetch('/api/emailcodeverify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { error: errorData.message || 'Code sending failed' };
            }

            toast({
                title: 'EmailCode verify Successful!',
                description: 'Welcome! Your code sending has been successful.',
            });

            router.push("/");

            return await response.json();
        
        } catch (error) {

            toast({
                title: 'Code Verify Failed!',
                description: 'Your action has failed. Please try again.',
            });
            throw error;
        }
    };

    const verifyEmailCode = async () => {
        const response = await onSubmit(userData);

        if (response && response.error) {
            console.error(response.error);
        } else {
            console.log("Success:", response);
        }
    };
    return (
        <div className='flex w-full h-[100vh] justify-center items-center '>
            <div className="border border-2 w-[350px] h-52 p-8 md:w-1/3">
                <h1 className="text-2xl font-semibold tracking-tight text-center">
                    Email Verification
                </h1>
                <div className='flex w-full justify-center mt-5'>
                    <input
                        className='w-96 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        maxLength={6}
                        onChange={(e) => setEmailCode(e.target.value)}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        }}
                    />
                </div>
                <div className='flex w-full justify-center mt-5'>
                    <Button
                        variant="default"
                        handleClick={verifyEmailCode}
                        className='w-96 text-white'
                    >
                        Email Code Verify
                    </Button>
                </div>
            </div>
        </div>
    );
}
