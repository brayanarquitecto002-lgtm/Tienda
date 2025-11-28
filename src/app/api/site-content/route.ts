import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      const content = data[0];
      return NextResponse.json({
        success: true,
        content: {
          heroTitle: content.hero_title,
          heroDescription: content.hero_description,
          aboutUs: content.about_us,
          mission: content.mission,
          vision: content.vision,
          logo: content.logo,
          heroImage: content.hero_image,
          socialLinks: {
            facebook: content.facebook || '',
            instagram: content.instagram || '',
            gmail: content.gmail || '',
            youtube: content.youtube || '',
            tiktok: content.tiktok || '',
          },
          whatsapp: content.whatsapp || '',
        }
      });
    } else {
      // Return default content if no data in DB
      return NextResponse.json({
        success: true,
        content: {
          heroTitle: 'Arquitectura Pro',
          heroDescription: 'Diseños arquitectónicos innovadores y sostenibles para transformar tus espacios.',
          aboutUs: 'Somos un equipo de arquitectos apasionados por crear espacios funcionales, estéticos y sostenibles. Con años de experiencia, hemos diseñado proyectos residenciales, comerciales e institucionales.',
          mission: 'Nuestra misión es proporcionar soluciones arquitectónicas de alta calidad que mejoren la calidad de vida de nuestros clientes, integrando innovación, sostenibilidad y funcionalidad en cada proyecto.',
          vision: 'Ser líderes en el diseño arquitectónico, reconocidos por nuestra excelencia, creatividad y compromiso con el desarrollo urbano sostenible.',
          logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=80&fit=crop&crop=center',
          heroImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop&crop=center',
          socialLinks: {
            facebook: '',
            instagram: '',
            gmail: '',
            youtube: '',
            tiktok: '',
          },
          whatsapp: '',
        }
      });
    }
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({
      success: false,
      message: `Error al cargar contenido del sitio: ${(error as Error).message}`
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      heroTitle, heroDescription, aboutUs, mission, vision,
      logo, heroImage, socialLinks, whatsapp
    } = body;

    // Check if content exists
    const { data: existing } = await supabase
      .from('site_content')
      .select('id')
      .limit(1);

    const siteData = {
      hero_title: heroTitle,
      hero_description: heroDescription,
      about_us: aboutUs,
      mission: mission,
      vision: vision,
      logo: logo,
      hero_image: heroImage,
      facebook: socialLinks?.facebook || '',
      instagram: socialLinks?.instagram || '',
      gmail: socialLinks?.gmail || '',
      youtube: socialLinks?.youtube || '',
      tiktok: socialLinks?.tiktok || '',
      whatsapp: whatsapp || '',
    };

    if (existing && existing.length > 0) {
      // Update existing content
      const { error } = await supabase
        .from('site_content')
        .update(siteData)
        .eq('id', existing[0].id);

      if (error) throw error;
    } else {
      // Insert new content
      const { error } = await supabase
        .from('site_content')
        .insert([siteData]);

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Contenido del sitio actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error saving site content:', error);
    return NextResponse.json({
      success: false,
      message: `Error al guardar contenido del sitio: ${(error as Error).message}`
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // PUT method - same logic as POST for compatibility
  return POST(request);
}