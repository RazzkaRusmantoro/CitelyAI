// app/api/send-support-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY);

// Create Supabase client
const supabase = await createClient();

interface SupportRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  supabaseId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SupportRequest = await req.json();
    const { firstName, lastName, email, phone, category, message, supabaseId } = body;
    const ticketId = `CT-${supabaseId}`;
    const timestamp = new Date().toLocaleString();

    // Single email to user with BCC to support team
    const userEmail = {
      from: 'Citera Support <support@citera.net>',
      to: [email],
      bcc: ['support@citera.net'],
      reply_to: 'support@citera.net',
      subject: `Support Request Received [#${ticketId}]`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Citera Support Confirmation</title>
            <!--[if mso]>
            <style type="text/css">
            body, table, td, div, p, a { font-family: Arial, Helvetica, sans-serif !important; }
            </style>
            <![endif]-->
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333333; background-color: #f9fafb; margin: 0; padding: 20px;">
            <!--[if mso]>
            <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px;">
                <tr>
                <td align="center" valign="top" width="600" style="width:600px;">
            <![endif]-->
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <!-- Header with Outlook-compatible background -->
                <div style="background-color: #f59e0b; padding: 30px; text-align: center;">
                    <!--[if mso]>
                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:90px;">
                    <v:fill type="frame" src="https://via.placeholder.com/600x90/f59e0b/f59e0b" color="#f59e0b" />
                    <v:textbox inset="0,0,0,0">
                    <![endif]-->
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; line-height: 1.2;">
                        Citera Support
                    </h1>
                    <!--[if mso]>
                    </v:textbox>
                    </v:rect>
                    <![endif]-->
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; font-size: 24px; font-weight: 600; margin-bottom: 20px; line-height: 1.3;">
                        Thank you for contacting Citera Support
                    </h2>
                    
                    <p style="color: #6b7280; font-size: 16px; margin-bottom: 30px; line-height: 1.5;">
                        Hello <strong>${firstName}</strong>, we've received your support request and will get back to you as soon as possible.
                    </p>

                    <!-- Summary Card -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                        <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin-bottom: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; line-height: 1.3;">
                            Request Summary
                        </h3>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                            <tr>
                                <td width="50%" valign="top" style="padding: 0 8px 16px 0;">
                                    <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Ticket ID</span>
                                    <span style="color: #1f2937; font-weight: 600; font-size: 15px; display: block;">${ticketId}</span>
                                </td>
                                <td width="50%" valign="top" style="padding: 0 0 16px 8px;">
                                    <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Category</span>
                                    <span style="color: #1f2937; font-weight: 600; font-size: 15px; display: block;">${category}</span>
                                </td>
                            </tr>
                            <tr>
                                <td width="50%" valign="top" style="padding: 0 8px 0 0;">
                                    <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Submitted</span>
                                    <span style="color: #1f2937; font-weight: 600; font-size: 15px; display: block;">${timestamp}</span>
                                </td>
                                <td width="50%" valign="top" style="padding: 0 0 0 8px;">
                                    <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 4px;">Phone</span>
                                    <span style="color: #1f2937; font-weight: 600; font-size: 15px; display: block;">${phone || 'Not provided'}</span>
                                </td>
                            </tr>
                        </table>

                        <div style="margin-bottom: 20px;">
                            <span style="color: #6b7280; font-size: 14px; display: block; margin-bottom: 8px;">Your Message</span>
                            <div style="background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                <p style="color: #374151; margin: 0; line-height: 1.5; font-size: 14px;">
                                    ${message.replace(/\n/g, '<br>')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Next Steps -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin-bottom: 15px; line-height: 1.3;">
                            What happens next?
                        </h3>
                        <ul style="color: #6b7280; padding-left: 20px; margin: 0;">
                            <li style="margin-bottom: 8px; line-height: 1.5;">Our support team will review your request</li>
                            <li style="margin-bottom: 8px; line-height: 1.5;">You'll receive a response within 24 hours</li>
                            <li style="margin-bottom: 8px; line-height: 1.5;">We may follow up with additional questions</li>
                        </ul>
                    </div>

                    <!-- Action Note -->
                    <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 16px; margin-bottom: 30px;">
                        <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500; line-height: 1.5;">
                            💡 <strong>Important:</strong> If you need to add more information, please reply to this email directly.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                        <p style="color: #9ca3af; font-size: 12px; line-height: 1.4; margin: 0;">
                            This is an automated confirmation message. Our support team has been notified and will contact you shortly.<br>
                        </p>
                    </div>
                </div>

            </div>
            <!--[if mso]>
                </td>
                </tr>
            </table>
            </center>
            <![endif]-->
        </body>
        </html>
      `,
    };

    // Send the single email
    const result = await resend.emails.send(userEmail);

    return NextResponse.json({ 
      message: 'Email sent successfully', 
      ticketId,
      emailData: result
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}