"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import type { DataSourceName } from "@/lib/CustomerContext";
import { useCustomer } from "@/lib/CustomerContext";
import { getSourceDashboardData, SOURCE_META } from "@/data/customerMock";

import SystemStatusCard from "./SystemStatusCard";
import QuestionsConsumedCard from "./QuestionsConsumedCard";
import ResponsesSentCard from "./ResponsesSentCard";
import DowntimeCard from "./DowntimeCard";
import DocumentRetrievalCard from "./DocumentRetrievalCard";
import ContentGenerationCard from "./ContentGenerationCard";
import ApiHitsCard from "./ApiHitsCard";
import ResponseLatencyCard from "./ResponseLatencyCard";
import ContentQualityDetailCard from "./ContentQualityDetailCard";
import KnowledgeSourceCard from "./KnowledgeSourceCard";

interface Props {
  source: DataSourceName;
  onBack: () => void;
}

export default function DataSourceDetail({ source, onBack }: Props) {
  const { customer } = useCustomer();
  const meta = SOURCE_META[source];

  const data = useMemo(
    () => getSourceDashboardData(customer.id, source),
    [customer.id, source]
  );

  const noop = () => {};

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${meta.bgLight} ${meta.bgDark} flex items-center justify-center text-lg`}>
            {meta.icon}
          </div>
          <div>
            <h2 className={`text-lg font-bold ${meta.color}`}>{source}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {customer.name} &mdash; Data Source Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Same card layout as main dashboard, but scoped to this data source */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SystemStatusCard data={data.systemStatus} onRefresh={noop} />
          <QuestionsConsumedCard data={data.questionsConsumed} onRefresh={noop} />
          <ResponsesSentCard data={data.responsesSent} onRefresh={noop} />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">System Performance</h2>
            <DowntimeCard data={data.downtime} onRefresh={noop} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">RAG-Specific Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DocumentRetrievalCard data={data.documentRetrieval} onRefresh={noop} />
              <ContentGenerationCard data={data.contentGeneration} onRefresh={noop} />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <ApiHitsCard data={data.apiHits} onRefresh={noop} />
          <ResponseLatencyCard data={data.responseLatency} onRefresh={noop} />
          <ContentQualityDetailCard data={data.contentQuality} onRefresh={noop} />
          <KnowledgeSourceCard data={data.knowledgeSources} onRefresh={noop} />
        </div>
      </div>
    </div>
  );
}
