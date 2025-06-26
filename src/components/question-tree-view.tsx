"use client";

import { useState } from "react";
import { useQuestionStore } from "@/store/questionStore";
import { Button, Modal } from "antd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddResearchQuestionForm } from "@/components/add-research-question-form";
import { AddAnswerForm } from "@/components/add-answer-form";
import { ChevronDown, ChevronRight, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface QuestionTreeViewProps {
  projectId: string;
}

export function QuestionTreeView({ projectId }: QuestionTreeViewProps) {
  const { bigQuestions, researchQuestions, deleteBigQuestion, deleteResearchQuestion, deleteAnswer, isLoading, error } = useQuestionStore();
  const [expandedBigQuestions, setExpandedBigQuestions] = useState<Set<string>>(new Set());
  const [expandedResearchQuestions, setExpandedResearchQuestions] = useState<Set<string>>(new Set());

  const toggleBigQuestion = (id: string) => {
    const newExpanded = new Set(expandedBigQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedBigQuestions(newExpanded);
  };

  const toggleResearchQuestion = (id: string) => {
    const newExpanded = new Set(expandedResearchQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResearchQuestions(newExpanded);
  };

  const showDeleteAnswerConfirm = (id: string) => {
    Modal.confirm({
      title: "Delete Answer",
      content: "Are you sure you want to delete this answer? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteAnswer(projectId, id);
        if (error) {
          toast.error("Error deleting answer", { description: error });
        } else {
          toast.success("Answer deleted successfully!");
        }
      },
    });
  };

  const showDeleteResearchQuestionConfirm = (id: string, text: string) => {
    Modal.confirm({
      title: "Delete Research Question",
      content: "Are you sure you want to delete this research question? This will also delete all its answers and unlink any child questions. This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteResearchQuestion(projectId, id);
        if (error) {
          toast.error("Error deleting research question", { description: error });
        } else {
          toast.success("Research question deleted successfully!", {
            description: `"${text}" has been removed.`,
          });
        }
      },
    });
  };

  const showDeleteBigQuestionConfirm = (id: string, text: string) => {
    Modal.confirm({
      title: "Delete Big Question",
      content: "Are you sure you want to delete this big question? This will unlink all associated research questions but won't delete them. This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteBigQuestion(projectId, id);
        if (error) {
          toast.error("Error deleting big question", { description: error });
        } else {
          toast.success("Big question deleted successfully!", {
            description: `"${text}" has been removed.`,
          });
        }
      },
    });
  };

  // Get orphaned research questions (not linked to any big question)
  const orphanedQuestions = researchQuestions.filter(rq => !rq.bigQuestionId && !rq.parentId);

  if (bigQuestions.length === 0 && orphanedQuestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No questions have been created yet.</p>
        <AddResearchQuestionForm projectId={projectId} triggerText="Add Your First Research Question" />
      </div>
    );
  }

  const renderAnswer = (answer: any) => (
    <div key={answer.id} className="ml-8 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-700 mb-2">{answer.text}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span><strong>Paper:</strong> {answer.paper.title}</span>
            {answer.location && <span><strong>Location:</strong> {answer.location}</span>}
          </div>
        </div>
        <Button
          danger
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => showDeleteAnswerConfirm(answer.id)}
        />
      </div>
    </div>
  );

  const renderResearchQuestion = (question: any, level: number = 0) => {
    const isExpanded = expandedResearchQuestions.has(question.id);
    const hasChildren = question.children && question.children.length > 0;
    const hasAnswers = question.answers && question.answers.length > 0;
    
    return (
      <div key={question.id} className={`ml-${level * 4} mb-4`}>
        <Card className="border-l-4 border-l-green-400">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {(hasChildren || hasAnswers) && (
                  <Button
                    icon={isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    onClick={() => toggleResearchQuestion(question.id)}
                  />
                )}
                <CardTitle className="text-lg text-green-700">{question.text}</CardTitle>
                <Badge>Research Question</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <AddResearchQuestionForm 
                  projectId={projectId} 
                  parentQuestionId={question.id}
                  triggerText="Add Sub-Question"
                />
                <AddAnswerForm 
                  projectId={projectId} 
                  researchQuestionId={question.id}
                />
                <Button
                  danger
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => showDeleteResearchQuestionConfirm(question.id, question.text)}
                />
              </div>
            </div>
          </CardHeader>
          {isExpanded && (
            <CardContent className="pt-0">
              {/* Render answers */}
              {hasAnswers && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Answers:</h4>
                  {question.answers.map(renderAnswer)}
                </div>
              )}
              
              {/* Render child questions */}
              {hasChildren && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Sub-Questions:</h4>
                  {question.children.map((child: any) => renderResearchQuestion(child, level + 1))}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Big Questions */}
      {bigQuestions.map((bigQuestion) => {
        const isExpanded = expandedBigQuestions.has(bigQuestion.id);
        const hasQuestions = bigQuestion.researchQuestions && bigQuestion.researchQuestions.length > 0;
        
        return (
          <Card key={bigQuestion.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {hasQuestions && (
                    <Button
                      icon={isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      onClick={() => toggleBigQuestion(bigQuestion.id)}
                    />
                  )}
                  <CardTitle className="text-xl text-blue-700">{bigQuestion.text}</CardTitle>
                  <Badge>Big Question</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <AddResearchQuestionForm 
                    projectId={projectId} 
                    bigQuestionId={bigQuestion.id}
                    triggerText="Add Research Question"
                  />
                  <Button
                    danger
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => showDeleteBigQuestionConfirm(bigQuestion.id, bigQuestion.text)}
                  />
                </div>
              </div>
            </CardHeader>
            {isExpanded && hasQuestions && (
              <CardContent>
                {bigQuestion.researchQuestions.map((question: any) => renderResearchQuestion(question))}
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Orphaned Research Questions */}
      {orphanedQuestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Independent Research Questions</h3>
          {orphanedQuestions.map((question) => renderResearchQuestion(question))}
        </div>
      )}

      {/* Add Research Question button for orphaned questions */}
      <div className="flex justify-center pt-4">
        <AddResearchQuestionForm 
          projectId={projectId} 
          triggerText="Add Independent Research Question"
        />
      </div>
    </div>
  );
}

