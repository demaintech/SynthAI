'use server'

import { createClient } from '@/src/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createConversation(title: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('conversations')
    .insert([{ title, user_id: user.id }])
    .select()
    .single()

  if (error) return { error: error.message }
  return { success: true, data }
}

export async function saveMessage(conversation_id: string, role: string, content: string) {
  const supabase = await createClient()
  console.log(`[SERVER] Saving message for ${conversation_id}: [${role}]`)
  
  const { error: msgError } = await supabase
    .from('messages')
    .insert([{ conversation_id, role, content }])

  if (msgError) {
    console.error('[SERVER] Save message error:', msgError)
    return { error: msgError.message }
  }

  console.log(`[SERVER] Message saved successfully`)
  return { success: true }
}

export async function getUserConversations() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[SERVER] Fetch conversations error:', error)
    return []
  }
  console.log(`[SERVER] Found ${data.length} conversations for user`)
  return data
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient()
  console.log(`[SERVER] Fetching messages for conversation: ${conversationId}`)
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[SERVER] Fetch messages error:', error)
    return []
  }
  console.log(`[SERVER] Found ${data?.length || 0} messages`)
  return data
}
