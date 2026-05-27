import { supabase } from '../lib/supabase'

export async function trackPageView(page='/') {

  try {

    await supabase
      .from('page_views')
      .insert({
        page,
        viewed_at:new Date().toISOString()
      })

  } catch(err) {

    console.log('Tracking failed', err)

  }

}