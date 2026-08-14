import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Iniciando correção de nomes dos leads...");

  // Busca todos os leads com suas conversas e mensagens
  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, phone, conversations (external_conversation_id, messages (direction, sender_external_id, body))");

  if (error) {
    console.error("Erro ao buscar leads:", error);
    return;
  }

  for (const lead of leads) {
    const conv = lead.conversations?.[0];
    const externalPhone = conv?.external_conversation_id;

    // Se o lead está com nome do médico ou genérico
    const isBadName =
      !lead.name ||
      lead.name.toLowerCase().includes("neuropsicologo") ||
      lead.name.toLowerCase().includes("ítalo p jardim") ||
      lead.name.toLowerCase().includes("assistente virtual");

    const phoneToSet = lead.phone || externalPhone || null;

    if (isBadName) {
      const newName = phoneToSet ? `+${phoneToSet}` : "Contato WhatsApp";
      console.log(`Corrigindo lead ${lead.id} de "${lead.name}" para "${newName}" (phone: ${phoneToSet})`);

      await supabase
        .from("leads")
        .update({
          name: newName,
          phone: phoneToSet,
        })
        .eq("id", lead.id);
    } else if (!lead.phone && externalPhone) {
      console.log(`Atualizando telefone do lead "${lead.name}" para "${externalPhone}"`);
      await supabase
        .from("leads")
        .update({ phone: externalPhone })
        .eq("id", lead.id);
    }
  }

  console.log("Correção concluída com sucesso!");
}

run();
