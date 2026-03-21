'use client';

import { useState } from 'react';
import { ArrowLeft, Briefcase, CheckCircle2, Clock, DollarSign, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { MotionFade, MotionSlideIn, MotionStagger } from '@/ui';
import { Badge } from '@/ui/shadcn/ui/badge';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/shadcn/ui/dialog';
import { Input } from '@/ui/shadcn/ui/input';
import { Label } from '@/ui/shadcn/ui/label';
import { Separator } from '@/ui/shadcn/ui/separator';
import { Textarea } from '@/ui/shadcn/ui/textarea';

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
};

const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    salary: '$130k - $160k',
    description:
      'Lead development of core UI components using React, Tailwind CSS, and shadcn/ui.',
  },
  {
    id: 2,
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$110k - $140k',
    description:
      'Shape intuitive, accessible experiences and collaborate closely with engineering.',
  },
  {
    id: 3,
    title: 'Developer Advocate',
    department: 'Developer Relations',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$120k - $150k',
    description:
      'Build community, write technical content, and represent the product in developer channels.',
  },
  {
    id: 4,
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'London, UK',
    type: 'Full-time',
    salary: '£80k - £110k',
    description: 'Build scalable APIs using Node.js, PostgreSQL, and Redis.',
  },
];

function JobApplicationDialog({ job }: { job: Job }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setIsSubmitted(false);
        setIsSubmitting(false);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-10 text-center">
            <CheckCircle2 className="mb-2 size-16 text-green-500" />
            <DialogTitle className="text-2xl">Application Submitted!</DialogTitle>
            <DialogDescription className="text-base">
              Thank you for applying for the <strong>{job.title}</strong> position. We received your
              application and will be in touch soon.
            </DialogDescription>
            <Button className="mt-6 w-full sm:w-auto" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription>
                Fill out the form below to apply. We will get back to you within 48 hours.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${job.id}`}>Full Name</Label>
                <Input id={`name-${job.id}`} required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`email-${job.id}`}>Email Address</Label>
                <Input id={`email-${job.id}`} type="email" required placeholder="janeexample.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`portfolio-${job.id}`}>Portfolio / LinkedIn URL</Label>
                <Input
                  id={`portfolio-${job.id}`}
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/janedoe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cover-letter-${job.id}`}>Cover Letter</Label>
                <Textarea
                  id={`cover-letter-${job.id}`}
                  required
                  className="min-h-[120px]"
                  placeholder="Tell us why you are a great fit for this role..."
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CareersRoute() {
  const router = useRouter();

  return (
    <MotionFade as="main" className="rail-borders mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
      <MotionSlideIn as="div" className="mb-10 flex items-center">
        <Button variant="ghost" className="-ml-3 gap-1 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
          <ArrowLeft />
          Back
        </Button>
      </MotionSlideIn>

      <MotionSlideIn as="section" delay={0.04} className="mx-auto mb-14 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-6xl">Join Our Team</h1>
        <p className="text-lg text-muted-foreground">
          We are building tools to make development faster, more accessible, and more delightful.
        </p>
      </MotionSlideIn>

      <MotionStagger as="section" className="mb-14 grid gap-6 md:grid-cols-3">
        <BenefitCard
          icon={<Briefcase className="size-6" />}
          title="Remote First"
          description="Work from anywhere. We value outcomes, not hours online."
        />
        <BenefitCard
          icon={<DollarSign className="size-6" />}
          title="Competitive Pay"
          description="Top-of-market compensation, equity, and solid benefits."
        />
        <BenefitCard
          icon={<Clock className="size-6" />}
          title="Flexible Hours"
          description="Own your schedule and collaborate with trust."
        />
      </MotionStagger>

      <Separator className="my-10" />

      <MotionSlideIn as="section" delay={0.08} className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">Open Positions</h2>
        <MotionStagger as="div" className="grid gap-6">
          {jobs.map(job => (
            <MotionFade key={job.id}>
              <Card>
                <CardHeader>
                  <div className="mb-2 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-4" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="size-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">{job.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <JobApplicationDialog job={job} />
                </CardFooter>
              </Card>
            </MotionFade>
          ))}
        </MotionStagger>
      </MotionSlideIn>
    </MotionFade>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-6 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
