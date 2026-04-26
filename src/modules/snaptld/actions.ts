"use server";

import { getSnapTldRepository } from "@/modules/snaptld/server/repository";
import type { AnalyzeQueueInput, CreateReportInput, DomainNote, FeedSource, ImportDomainsInput, SnapTldSettings } from "@/modules/snaptld/types";

const repository = () => getSnapTldRepository();

export async function toggleWatchAction(slug: string) {
  return repository().toggleWatch(slug);
}

export async function addWatchManyAction(slugs: string[]) {
  return repository().addWatchMany(slugs);
}

export async function toggleReviewedAction(slug: string) {
  return repository().toggleReviewed(slug);
}

export async function addReviewedManyAction(slugs: string[]) {
  return repository().addReviewedMany(slugs);
}

export async function toggleHiddenAction(slug: string) {
  return repository().toggleHidden(slug);
}

export async function addHiddenManyAction(slugs: string[]) {
  return repository().addHiddenMany(slugs);
}

export async function saveNoteAction(slug: string, note: DomainNote | null) {
  return repository().saveNote(slug, note);
}

export async function saveWeightsAction(yaml: string) {
  return repository().saveWeights(yaml);
}

export async function resetWeightsAction() {
  return repository().resetWeights();
}

export async function saveSettingsAction(settings: SnapTldSettings) {
  return repository().saveSettings(settings);
}

export async function rerunAnalysisAction(slug: string, step?: string) {
  return repository().rerunAnalysis(slug, step);
}

export async function analyzeQueueAction(input: AnalyzeQueueInput) {
  return repository().analyzeQueue(input);
}

export async function importDomainsAction(input: ImportDomainsInput) {
  return repository().importDomains(input);
}

export async function updateFeedScheduleAction(feedId: string, schedule: FeedSource["schedule"]) {
  return repository().updateFeedSchedule(feedId, schedule);
}

export async function toggleFeedStatusAction(feedId: string) {
  return repository().toggleFeedStatus(feedId);
}

export async function runFeedAction(feedId: string) {
  return repository().runFeed(feedId);
}

export async function runActiveFeedsAction() {
  return repository().runActiveFeeds();
}

export async function createReportAction(input: CreateReportInput) {
  return repository().createReport(input);
}
