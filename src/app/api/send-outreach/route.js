import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST — send outreach emails individually or as a group
export async function POST(request) {
  try {
    const body = await request.json();
    const { businessIds, subject, htmlContent, fromName, fromEmail } = body;

    if (!businessIds || businessIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No business IDs provided' }, { status: 400 });
    }
    if (!subject || !htmlContent) {
      return NextResponse.json({ success: false, error: 'Subject and content are required' }, { status: 400 });
    }

    // Fetch businesses with emails
    const { data: businesses, error: fetchError } = await supabase
      .from('discovered_businesses')
      .select('id, name, email, website, region')
      .in('id', businessIds)
      .not('email', 'is', null)
      .neq('email', '');

    if (fetchError) {
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No businesses with valid email addresses found in selection'
      }, { status: 400 });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send emails
    const results = [];
    for (const biz of businesses) {
      try {
        // Personalize the email
        const personalizedHtml = htmlContent
          .replace(/\{\{name\}\}/g, biz.name)
          .replace(/\{\{website\}\}/g, biz.website || '')
          .replace(/\{\{region\}\}/g, biz.region || '');

        await transporter.sendMail({
          from: `"${fromName || 'Pacific Discovery Network'}" <${fromEmail || process.env.SMTP_USER}>`,
          to: biz.email,
          subject: subject.replace(/\{\{name\}\}/g, biz.name),
          html: personalizedHtml,
        });

        results.push({ id: biz.id, name: biz.name, email: biz.email, status: 'sent' });

        // Update the business record
        await supabase
          .from('discovered_businesses')
          .update({
            metadata: supabase.rpc ? undefined : { lastEmailed: new Date().toISOString() },
            updated_at: new Date().toISOString()
          })
          .eq('id', biz.id);

        // Rate limit between sends
        await new Promise(r => setTimeout(r, 500));

      } catch (sendErr) {
        results.push({ id: biz.id, name: biz.name, email: biz.email, status: 'failed', error: sendErr.message });
      }
    }

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      data: {
        total: businesses.length,
        sent,
        failed,
        results
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
