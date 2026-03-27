import { requireAdmin } from '@/lib/server-auth';

/**
 * Admin API for updating business data
 * Uses service client to bypass RLS restrictions
 */
export async function PUT(request, context) {
  try {
    const params = await context.params;
    const businessId = params?.id;

    console.log('API: Extracted businessId:', businessId);
    console.log('API: Full params:', params);
    console.log('API: Request URL:', request.url);

    if (!businessId || businessId === 'undefined' || businessId === '' || businessId === 'null') {
      console.error('API: Business ID validation failed:', { businessId, params });
      return Response.json(
        {
          error: 'Business ID is required',
          details: `Received businessId: ${businessId}`,
          params,
          url: request.url,
        },
        { status: 400 }
      );
    }

    const auth = await requireAdmin(request);
    if (auth.error) {
      return Response.json({ error: auth.error }, { status: auth.status });
    }

    const { serviceClient } = auth;
    const requestBody = await request.json();

    console.log("API requestBody keys:", Object.keys(requestBody || {}));
    console.log("API files payload:", requestBody?.files);
    console.log("API removals payload:", requestBody?.removals);
    console.log("API businessesData keys:", Object.keys(requestBody?.businessesData || {}));

    const { businessesData, files, removals } = requestBody;

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

    if (!canUploadImages && hasFileUploads) {
      console.log('🎨 Vaka plan detected - ignoring uploaded files.');
    }

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

    console.log("API finalPayload keys:", Object.keys(finalPayload || {}));

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
    console.log("Supabase update result data:", data);
    console.log("Supabase update result error:", error);

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
