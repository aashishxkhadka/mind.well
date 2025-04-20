import Link from "next/link"
import { ExternalLink, Search, Phone, BookOpen, Lightbulb, HeartPulse, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const resources = {
  crisis: [
    {
      title: "National Suicide Prevention Lifeline",
      description: "24/7, free and confidential support for people experiencing depression and suicidal thoughts.",
      link: "https://suicidepreventionlifeline.org/",
      phone: "1-800-273-8255",
      tags: ["24/7", "Hotline", "Suicidal Thoughts"],
    },
    {
      title: "Crisis Text Line",
      description: "Text HOME to 741741 to connect with a Crisis Counselor for depression and suicidal thoughts.",
      link: "https://www.crisistextline.org/",
      phone: "Text HOME to 741741",
      tags: ["24/7", "Text", "Depression"],
    },
    {
      title: "SAMHSA's National Helpline",
      description: "Information and referrals for depression treatment options and support groups.",
      link: "https://www.samhsa.gov/find-help/national-helpline",
      phone: "1-800-662-4357",
      tags: ["Referral", "Treatment", "Depression"],
    },
    {
      title: "Depression Hotline",
      description: "Confidential support for individuals dealing with depression and related mental health issues.",
      link: "https://www.depression-hotline.com/",
      phone: "1-866-903-3787",
      tags: ["Depression", "Support", "Crisis"],
    },
  ],
  treatment: [
    {
      title: "Psychology Today Therapist Finder",
      description:
        "Find therapists specializing in depression treatment in your area, including those offering teletherapy.",
      link: "https://www.psychologytoday.com/us/therapists/depression",
      tags: ["Therapy", "Professional", "Directory"],
    },
    {
      title: "Talkspace",
      description: "Online therapy platform with licensed therapists specializing in depression treatment.",
      link: "https://www.talkspace.com/",
      tags: ["Online Therapy", "Professional", "Subscription"],
    },
    {
      title: "BetterHelp",
      description: "Online counseling platform with therapists experienced in treating depression.",
      link: "https://www.betterhelp.com/",
      tags: ["Online Therapy", "Counseling", "Depression"],
    },
    {
      title: "NIMH Depression Treatment Information",
      description:
        "Comprehensive guide to depression treatments including medication, therapy, and brain stimulation therapies.",
      link: "https://www.nimh.nih.gov/health/topics/depression/index.shtml#part_145399",
      tags: ["Treatment", "Information", "Research-based"],
    },
    {
      title: "Postpartum Support International",
      description: "Resources for postpartum depression, including helpline and support group finder.",
      link: "https://www.postpartum.net/",
      phone: "1-800-944-4773",
      tags: ["Postpartum", "Depression", "Support"],
    },
  ],
  selfHelp: [
    {
      title: "Woebot",
      description: "AI chatbot using cognitive-behavioral therapy techniques to help manage depression.",
      link: "https://woebothealth.com/",
      tags: ["App", "CBT", "Depression"],
    },
    {
      title: "MoodMission",
      description: "App that provides evidence-based strategies to help overcome depression and anxiety.",
      link: "https://moodmission.com/",
      tags: ["App", "Strategies", "Depression"],
    },
    {
      title: "Depression CBT Self-Help Guide",
      description: "App with tools based on cognitive behavioral therapy to help manage depression.",
      link: "https://play.google.com/store/apps/details?id=com.excelatlife.depression",
      tags: ["App", "CBT", "Self-help"],
    },
    {
      title: "Happify",
      description:
        "Science-based activities and games to reduce stress, overcome negative thoughts, and build resilience.",
      link: "https://www.happify.com/",
      tags: ["App", "Positive Psychology", "Activities"],
    },
    {
      title: "7 Cups",
      description: "Online platform offering free support from trained listeners specifically for depression.",
      link: "https://www.7cups.com/depression-help-online/",
      tags: ["Peer Support", "Free", "Depression"],
    },
  ],
  education: [
    {
      title: "NIMH Depression Information",
      description: "Comprehensive overview of depression, including symptoms, causes, and treatments.",
      link: "https://www.nimh.nih.gov/health/topics/depression",
      tags: ["Information", "Research", "Symptoms"],
    },
    {
      title: "Mayo Clinic Depression Guide",
      description: "Detailed information about depression symptoms, causes, risk factors, and when to see a doctor.",
      link: "https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007",
      tags: ["Medical", "Symptoms", "Treatment"],
    },
    {
      title: "HelpGuide Depression Articles",
      description: "Evidence-based articles on depression, including self-help strategies and treatment options.",
      link: "https://www.helpguide.org/articles/depression/depression-symptoms-and-warning-signs.htm",
      tags: ["Self-help", "Symptoms", "Strategies"],
    },
    {
      title: "Depression and Bipolar Support Alliance",
      description: "Educational resources and support for people living with depression and bipolar disorder.",
      link: "https://www.dbsalliance.org/education/depression/",
      tags: ["Support", "Education", "Community"],
    },
    {
      title: "American Psychological Association Depression Resources",
      description:
        "Research-based information about depression from the leading scientific organization for psychology.",
      link: "https://www.apa.org/topics/depression",
      tags: ["Research", "Psychology", "Information"],
    },
  ],
  support: [
    {
      title: "Depression and Bipolar Support Alliance Groups",
      description: "Peer-led support groups for people with depression, both in-person and online.",
      link: "https://www.dbsalliance.org/support/chapters-and-support-groups/find-a-support-group/",
      tags: ["Support Group", "Peer-led", "Community"],
    },
    {
      title: "Mental Health America Support Groups",
      description: "Directory of depression support groups across the United States.",
      link: "https://www.mhanational.org/find-support-groups",
      tags: ["Support Group", "Directory", "Local"],
    },
    {
      title: "Reddit r/depression",
      description: "Online community where people share experiences and support for depression.",
      link: "https://www.reddit.com/r/depression/",
      tags: ["Online Community", "Peer Support", "Discussion"],
    },
    {
      title: "18percent",
      description: "Free, peer-to-peer online mental health community with dedicated spaces for depression.",
      link: "https://18percent.org/",
      tags: ["Online Community", "Peer Support", "Free"],
    },
    {
      title: "Depression Forums",
      description: "Online forum community offering peer support for depression and related conditions.",
      link: "https://www.depressionforums.org/",
      tags: ["Forum", "Community", "Discussion"],
    },
  ],
}

export default function ResourcesPage() {
  return (
    <div className="container py-8 px-4 mx-auto">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resources</h1>
          <p className="text-muted-foreground">
            Comprehensive resources for understanding, managing, and finding support for depression
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search depression resources..." className="pl-10" />
        </div>

        {/* Resources Tabs */}
        <Tabs defaultValue="crisis" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Crisis Help</span>
            </TabsTrigger>
            <TabsTrigger value="treatment" className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4" />
              <span>Treatment</span>
            </TabsTrigger>
            <TabsTrigger value="selfHelp" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Self-Help</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Support Groups</span>
            </TabsTrigger>
          </TabsList>

          {/* Crisis Support Tab */}
          <TabsContent value="crisis" className="space-y-4">
            <div className="grid gap-4">
              {resources.crisis.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* Treatment Tab */}
          <TabsContent value="treatment" className="space-y-4">
            <div className="grid gap-4">
              {resources.treatment.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* Self-Help Tab */}
          <TabsContent value="selfHelp" className="space-y-4">
            <div className="grid gap-4">
              {resources.selfHelp.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <div className="grid gap-4">
              {resources.education.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </TabsContent>

          {/* Support Groups Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="grid gap-4">
              {resources.support.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Suicide Prevention Notice */}
        <div className="mt-8 bg-destructive/10 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="bg-destructive/20 p-3 rounded-full">
              <Phone className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Suicidal Thoughts?</h2>
              <p className="mb-4">
                If you're thinking about suicide or experiencing a mental health crisis, please call the National
                Suicide Prevention Lifeline immediately at <strong className="text-foreground">1-800-273-8255</strong>{" "}
                or text HOME to <strong className="text-foreground">741741</strong> to reach the Crisis Text Line.
              </p>
              <p className="text-muted-foreground">
                These services are free, confidential, and available 24/7. You don't have to face depression alone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Resource Card Component
function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{resource.title}</CardTitle>
            {resource.phone && <CardDescription className="mt-1 font-medium">{resource.phone}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground">{resource.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {resource.tags.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={resource.link} target="_blank" rel="noopener noreferrer">
            Visit Resource
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
