import { requireAdmin } from '@/lib/server-auth';

/**
 * Admin API for updating business data
 * Uses service client to bypass RLS restrictions
 */
export async function PUT(request, context) {
  try {
    const params = await context.params;
    const businessId = params?.id;

    if (!businessId || businessId === 'undefined' || businessId === '' || businessId === 'null') {
      return Response.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;

    // Parse FormData (supports file uploads)
    const formData = await request.formData();
    const businessesData = JSON.parse(formData.get('businessesData') || '{}');
    const removals = JSON.parse(formData.get('removals') || '{}');

    // Extract file uploads
    const files = {
      logo_file: formData.get('logo_file') || null,
      banner_file: formData.get('banner_file') || null,
      mobile_banner_file: formData.get('mobile_banner_file') || null,
    };

    const {
      prepareBusinessBrandingPayload,
    } = await import('@/utils/brandingUploadUtils');

    const { sanitizeBusinessPayload } = await import('@/utils/dataTransformers');
    const { SUBSCRIPTION_TIER } = await import('@/constants/unifiedConstants');

    let businessesPayload = { ...businessesData };
    delete businessesPayload.logo_file;
    delete businessesPayload.banner_file;
    delete businessesPayload.mobile_banner_file;

    const subscriptionTier =
      businessesPayload.subscription_tier || SUBSCRIPTION_TIER.VAKA;

    const canUploadImages =
      subscriptionTier === SUBSCRIPTION_TIER.MANA ||
      subscriptionTier === SUBSCRIPTION_TIER.MOANA;

    const hasFileUploads = files && Object.keys(files).some((key) => files[key]);

    let brandingPayload = {};

    try {
      brandingPayload = await prepareBusinessBrandingPayload({
        supabase: serviceClient,
        businessId,
        businessesData: businessesPayload,
        files: canUploadImages ? (files || {}) : {},
        removals: removals || {},
      });
    } catch (error) {
      console.error("prepareBusinessBrandingPayload failed:", error);
      return Response.json(
        {
          error: "Branding payload preparation failed",
          details: error?.message || "Unknown branding error",
        },
        { status: 500 }
      );
    }

    const consolidatedPayload = {
      ...businessesPayload,
      ...brandingPayload,
    };

    const sanitizedPayload = sanitizeBusinessPayload(consolidatedPayload);

    const finalPayload = {
      ...sanitizedPayload,
      updated_at: new Date().toISOString(),
    };

    let updateResult;
    try {
      updateResult = await serviceClient
        .from('businesses')
        .update(finalPayload)
        .eq('id', businessId)
        .select()
        .single();
    } catch (error) {
      console.error("Supabase update threw before response:", error);
      return Response.json(
        {
          error: "Supabase update threw",
          details: error?.message || "Unknown update error",
        },
        { status: 500 }
      );
    }

    const { data, error } = updateResult;

    if (error) {
      console.error('Admin business update error:', error);
      return Response.json(
        { error: 'Failed to update business', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json(
        { error: 'Update completed but no business data returned' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      business: data,
      message: 'Business updated successfully',
    });
  } catch (error) {
    console.error('Admin business API error:', error);
    return Response.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
