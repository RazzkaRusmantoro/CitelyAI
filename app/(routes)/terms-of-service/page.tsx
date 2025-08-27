"use client";
import Navbar from "@/components/navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import { FileText, Shield, AlertCircle, BookOpen, Clock, Globe, User, CreditCard, Lock, Mail, Heart, Database, Server, Eye, Bell } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">By accessing or using the Citely website, application, or any services provided by Citely (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.</p>
          <p className="mb-4">These Terms constitute a legally binding agreement between you ("User") and Citely ("Company", "we", "us", or "our"). If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.</p>
          <p>We may modify these Terms at any time, and such modifications will be effective upon posting. Your continued use of the Service after any modification constitutes your acceptance of the modified Terms.</p>
        </>
      )
    },
    {
      title: "2. Description of Service",
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">Citely provides an AI-powered platform for citation generation, bibliography management, academic research assistance, and related services. The Service includes, but is not limited to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Automated citation generation in various academic formats (APA, MLA, Chicago, etc.)</li>
            <li>Bibliography organization and management tools</li>
            <li>Academic source discovery and recommendation</li>
            <li>Source credibility assessment</li>
            <li>Document analysis for citation opportunities</li>
            <li>Research paper summarization</li>
            <li>Related AI-powered research assistance features</li>
          </ul>
          <p>We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, including the availability of any feature, database, or content. We may also impose limits on certain features and services or restrict your access to parts or all of the Service without notice or liability.</p>
        </>
      )
    },
    {
      title: "3. User Accounts",
      icon: <User className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">To access certain features of the Service, you must register for an account. When registering, you agree to provide accurate, current, and complete information about yourself as prompted by the registration form.</p>
          <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.</p>
          <p className="mb-4">You must be at least 13 years old to use the Service. If you are under the age of 18, you represent that you have your parent or guardian's permission to use the Service and that they have read and agreed to these Terms on your behalf. If you are residing in a jurisdiction that restricts the use of the Service based on age, or restricts the ability to enter into contracts such as this one due to age, you must abide by such age limits.</p>
          <p>We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.</p>
        </>
      )
    },
    {
      title: "4. User Conduct and Responsibilities",
      icon: <Globe className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm the Company or users of the Service</li>
          </ul>
          <p className="mb-4">Additionally, you agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Use the Service in any manner that could disable, overburden, damage, or impair the site or interfere with any other party's use of the Service</li>
            <li>Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose</li>
            <li>Introduce any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service</li>
            <li>Otherwise attempt to interfere with the proper working of the Service</li>
          </ul>
          <p>You are solely responsible for your conduct and any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, works of authorship, applications, links, and other content or materials that you submit, post, or display on or via the Service.</p>
        </>
      )
    },
    {
      title: "5. Intellectual Property Rights",
      icon: <FileText className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by the Company, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
          <p className="mb-4">These Terms permit you to use the Service for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service, except as follows:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials</li>
            <li>You may store files that are automatically cached by your Web browser for display enhancement purposes</li>
            <li>You may print or download one copy of a reasonable number of pages of the Service for your own personal, non-commercial use and not for further reproduction, publication, or distribution</li>
          </ul>
          <p className="mb-4">You must not:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Modify copies of any materials from the Service</li>
            <li>Use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text</li>
            <li>Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials from the Service</li>
          </ul>
          <p>If you wish to make any use of material on the Service other than that set out in this section, please address your request to: legal@citely.com.</p>
        </>
      )
    },
    {
      title: "6. User Content and License Grant",
      icon: <Database className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">The Service may allow you to upload, submit, store, send, or receive content and data ("User Content"). You retain ownership of any intellectual property rights that you hold in that User Content.</p>
          <p className="mb-4">When you upload, submit, store, send, or receive User Content to or through the Service, you grant us a worldwide, royalty-free, sublicensable, and transferable license to host, store, use, display, reproduce, modify, adapt, edit, publish, and distribute such User Content for the limited purposes of operating, developing, providing, promoting, and improving the Service and researching and developing new services.</p>
          <p className="mb-4">This license continues even if you stop using our Service (for example, for content that we need to retain for legal purposes). You represent and warrant that you have all the rights, power, and authority necessary to grant the rights granted herein to any User Content that you submit.</p>
          <p>We do not claim ownership of your User Content. However, by using the Service, you agree that we may collect and use technical data and related information about your use of the Service that is gathered periodically to facilitate the provision of software updates, product support, and other services to you.</p>
        </>
      )
    },
    {
      title: "7. Payment Terms and Billing",
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">Certain aspects of the Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the pricing and payment terms as we may update them from time to time. We may add new services for additional fees and charges, or amend fees and charges for existing services, at any time in our sole discretion.</p>
          <p className="mb-4">You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Service. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.</p>
          <p className="mb-4">We bill through an online billing account for purchases. Fees are non-refundable except as required by law or as otherwise specifically permitted in these Terms. You agree to pay all charges incurred by users of your credit card, debit card, or other payment method used in connection with a purchase or transaction at the prices in effect when such charges are incurred.</p>
          <p className="mb-4">If your payment method fails or your account is past due, we may collect fees owed using other collection mechanisms. This may include charging other payment methods on file with us, retaining collection agencies, and legal action. You are responsible for all transaction fees, currency exchange fees, and taxes associated with your use of the Service.</p>
          <p>Subscription services automatically renew until canceled. You may cancel your subscription at any time through your account settings. If you cancel, you will continue to have access to the subscription features until the end of your current billing period.</p>
        </>
      )
    },
    {
      title: "8. Termination",
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">These Terms are effective unless and until terminated by either you or us. You may terminate these Terms at any time by notifying us that you no longer wish to use our Service, or when you cease using our site.</p>
          <p className="mb-4">We may suspend or terminate your rights to use the Service (including your account) at any time for any reason at our sole discretion, including for any use of the Service in violation of these Terms. Upon termination of your rights under these Terms, your account and right to access and use the Service will terminate immediately.</p>
          <p>We will not have any liability whatsoever to you for any termination of your rights under these Terms, including for termination of your account. Even after your rights under these Terms are terminated, the following provisions will remain in effect: Sections 5, 6, 9, 10, 11, and 12.</p>
        </>
      )
    },
    {
      title: "9. Disclaimer of Warranties",
      icon: <Shield className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">YOUR USE OF THE SERVICE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICE IS AT YOUR OWN RISK. THE SERVICE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
          <p className="mb-4">NEITHER THE COMPANY NOR ANY PERSON ASSOCIATED WITH THE COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICE. WITHOUT LIMITING THE FOREGOING, NEITHER THE COMPANY NOR ANYONE ASSOCIATED WITH THE COMPANY REPRESENTS OR WARRANTS THAT THE SERVICE, ITS CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICE WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR SERVICE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT THE SERVICE OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICE WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.</p>
          <p>THE COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.</p>
        </>
      )
    },
    {
      title: "10. Limitation of Liability",
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">IN NO EVENT WILL THE COMPANY, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE SERVICE OR SUCH OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.</p>
          <p className="mb-4">THE FOREGOING DOES NOT AFFECT ANY LIABILITY THAT CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</p>
          <p>IN NO EVENT SHALL THE TOTAL LIABILITY OF THE COMPANY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION (WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE) EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE SERVICE DURING THE TWELVE (12) MONTHS PRIOR TO THE CLAIM OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.</p>
        </>
      )
    },
    {
      title: "11. Indemnification",
      icon: <Shield className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">You agree to defend, indemnify, and hold harmless the Company, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service, including, but not limited to, your User Content, any use of the Service's content, services, and products other than as expressly authorized in these Terms, or your use of any information obtained from the Service.</p>
          <p>We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will assist and cooperate with us in asserting any available defenses.</p>
        </>
      )
    },
    {
      title: "12. Governing Law and Jurisdiction",
      icon: <Globe className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">All matters relating to the Service and these Terms, and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of Delaware without giving effect to any choice or conflict of law provision or rule (whether of the State of Delaware or any other jurisdiction).</p>
          <p>Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Service shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware, in each case located in the City of Wilmington and County of New Castle, although we retain the right to bring any suit, action, or proceeding against you for breach of these Terms in your country of residence or any other relevant country. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.</p>
        </>
      )
    },
    {
      title: "13. Changes to Terms",
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them, and apply to all access to and use of the Service thereafter.</p>
          <p className="mb-4">Your continued use of the Service following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page from time to time so you are aware of any changes, as they are binding on you.</p>
          <p>We may provide notice of significant changes to the Terms by email notification to the email address associated with your account or by placing a prominent notice on our site. The date the Terms were last revised is identified at the top of the page.</p>
        </>
      )
    },
    {
      title: "14. Miscellaneous",
      icon: <FileText className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">These Terms, together with the Privacy Policy and any other agreements expressly incorporated by reference herein, constitute the sole and entire agreement between you and Citely regarding the Service and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Service.</p>
          <p className="mb-4">If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.</p>
          <p className="mb-4">The failure of us to exercise or enforce any right or provision of these Terms shall not operate as a waiver of such right or provision. The section titles in these Terms are for convenience only and have no legal or contractual effect.</p>
          <p>These Terms are personal to you and may not be assigned or transferred by you without our prior written consent. We may assign our rights under these Terms to any party without your consent.</p>
        </>
      )
    },
    {
      title: "15. Contact Information",
      icon: <Mail className="w-5 h-5 text-amber-500" />,
      content: (
        <>
          <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
          <p className="mb-2">Citely Inc.</p>
          <p className="mb-2">Email: legal@citely.com</p>
          <p>We will make our best effort to respond to your inquiry within a reasonable time frame.</p>
        </>
      )
    }
  ];

  return (
    <>
      <div className="relative overflow-hidden min-h-screen flex flex-col">
        <Navbar />
        {/* Background Beams */}
        <div className="absolute inset-0 -z-10">
          <BackgroundBeams />
        </div>

        <div className="flex-1 pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header Section */}
            <FadeInOnScroll>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Terms of Service
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Please read these Terms of Service carefully before using Citely's services.
                </p>
              </div>
            </FadeInOnScroll>

            {/* Main Content Container */}
            <FadeInOnScroll>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                {/* Introduction */}
                <div className="mb-10 pb-8 border-b border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Welcome to Citely. These Terms of Service govern your use of our website and services. 
                    By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. 
                    If you disagree with any part of the terms, you may not access our services.
                  </p>
                </div>

                {/* Terms Sections */}
                <div className="space-y-10">
                  {sections.map((section, index) => (
                    <div key={index} className="pb-8 last:pb-0 last:border-b-0 border-b border-gray-100">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                          {section.icon}
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {section.title}
                        </h2>
                      </div>
                      <div className="text-gray-700 leading-relaxed pl-14">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Notice */}
                <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-amber-800 mb-2">
                        Important Notice
                      </h3>
                      <p className="text-amber-700">
                        These Terms of Service constitute a legally binding agreement between you and Citely. 
                        It is important that you read them carefully. If you have any questions, please contact us at legal@citely.com.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}