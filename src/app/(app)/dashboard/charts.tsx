"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Breakdowns, TimeseriesRow } from "@/lib/crm/dashboard";
import { channelLabel, formatBRL } from "@/lib/format";

// Paleta ORDO nos gráficos: burgundy lidera, brass orienta.
// Sem gradientes e sem cores fora da paleta — regra do brand book.
const COLORS = {
  primary: "#521D2A", // burgundy
  brass: "#B2966F",
  light: "#8C5A63", // burgundy claro, para a terceira série
  deep: "#291015",
  muted: "#B6AEA4", // stone
};

const axisStyle = { fontSize: 12, fill: "currentColor" };

function shortDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function TimeseriesChart({ data }: { data: TimeseriesRow[] }) {
  if (data.length === 0) {
    return <EmptyChart label="Sem movimentação no período." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
        <XAxis dataKey="day" tickFormatter={shortDate} tick={axisStyle} />
        <YAxis allowDecimals={false} tick={axisStyle} />
        <Tooltip
          labelFormatter={(value) => shortDate(String(value))}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="new_leads"
          name="Novos leads"
          stroke={COLORS.primary}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sessions_completed"
          name="Sessões realizadas"
          stroke={COLORS.light}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sales"
          name="Vendas"
          stroke={COLORS.brass}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ChannelChart({ data }: { data: Breakdowns["by_channel"] }) {
  if (data.length === 0) return <EmptyChart label="Sem leads no período." />;

  const rows = data.map((row) => ({
    ...row,
    label: channelLabel(row.key),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
        <XAxis dataKey="label" tick={axisStyle} />
        <YAxis allowDecimals={false} tick={axisStyle} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="leads" name="Leads" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="conversions"
          name="Vendas"
          fill={COLORS.brass}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueByProductChart({
  data,
}: {
  data: Breakdowns["by_product"];
}) {
  if (data.length === 0) return <EmptyChart label="Nenhuma venda no período." />;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
        <XAxis type="number" tick={axisStyle} />
        <YAxis
          type="category"
          dataKey="key"
          width={150}
          tick={{ ...axisStyle, fontSize: 11 }}
        />
        <Tooltip
          formatter={(value) => formatBRL(Number(value))}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="revenue" name="Receita" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LostReasonsChart({
  data,
}: {
  data: Breakdowns["by_lost_reason"];
}) {
  if (data.length === 0) {
    return <EmptyChart label="Nenhuma perda registrada no período." />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
        <XAxis type="number" allowDecimals={false} tick={axisStyle} />
        <YAxis
          type="category"
          dataKey="key"
          width={170}
          tick={{ ...axisStyle, fontSize: 11 }}
        />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Bar dataKey="total" name="Leads perdidos" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={index === 0 ? COLORS.brass : COLORS.muted}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
      {label}
    </div>
  );
}
