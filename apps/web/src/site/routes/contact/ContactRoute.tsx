'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MotionFade, MotionSlideIn } from '@/ui';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Input } from '@/ui/shadcn/ui/input';
import { Label } from '@/ui/shadcn/ui/label';
import { Textarea } from '@/ui/shadcn/ui/textarea';

export function ContactRoute() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <MotionFade as="main" className="rail-borders mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
      <MotionSlideIn as="div" className="mb-10 flex items-center">
        <Button variant="ghost" className="-ml-3 gap-1 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
          <ArrowLeft />
          Back
        </Button>
      </MotionSlideIn>

      <MotionSlideIn as="section" delay={0.04} className="mx-auto mb-14 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">
          Have a question, feedback, or partnership idea? We would love to hear from you.
        </p>
      </MotionSlideIn>

      <MotionSlideIn as="section" delay={0.08} className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <CardDescription>Reach out to us directly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ContactItem
                icon={<Mail className="size-5" />}
                title="Email"
                content={<p className="text-sm text-muted-foreground">hellopytholit.com</p>}
              />
              <ContactItem
                icon={<Phone className="size-5" />}
                title="Phone"
                content={<p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>}
              />
              <ContactItem
                icon={<MapPin className="size-5" />}
                title="Office"
                content={
                  <p className="text-sm text-muted-foreground">
                    123 Tech Avenue
                    <br />
                    San Francisco, CA 94105
                  </p>
                }
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
              <CardDescription>
                Fill out the form and we will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                  <CheckCircle2 className="mb-2 size-16 text-green-500" />
                  <h3 className="text-2xl font-semibold">Message Sent!</h3>
                  <p className="max-w-md text-muted-foreground">
                    Thanks for reaching out. We received your message and will respond within 24-48
                    hours.
                  </p>
                  <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" required placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" required placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input id="contact-email" type="email" required placeholder="johnexample.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required placeholder="How can we help you?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      required
                      className="min-h-[150px]"
                      placeholder="Your message here..."
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </MotionSlideIn>
    </MotionFade>
  );
}

function ContactItem({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {content}
      </div>
    </div>
  );
}
