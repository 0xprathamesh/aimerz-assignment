"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Filter,
  X,
  ChevronDown,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TodoFilters } from "@/lib/stores/todo-store";
import { CATEGORY_COLORS } from "@/lib/constants";

const CATEGORIES = [
  "Work",
  "Health",
  "Finance",
  "Travel",
  "Personal",
  "Education",
  "Shopping",
  "Daily",
  "Other",
];

const PRIORITY_CONFIG = [
  {
    value: "high",
    label: "High Priority",
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    count: 0,
  },
  {
    value: "medium",
    label: "Medium Priority",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    border: "border-yellow-200 dark:border-yellow-800",
    count: 0,
  },
  {
    value: "low",
    label: "Low Priority",
    icon: CheckCircle2,
    color: "text-gray-600",
    bg: "bg-gray-50 dark:bg-gray-950/20",
    border: "border-gray-200 dark:border-gray-800",
    count: 0,
  },
];

const STATUS_CONFIG = [
  {
    value: "all",
    label: "All Statuses",
    color: "bg-gray-400",
  },
  {
    value: "pending",
    label: "Pending",
    color: "bg-orange-400",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-400",
  },
];

interface FiltersModalProps {
  filters: TodoFilters;
  setFilters: (filters: Partial<TodoFilters>) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  totalTodos?: number;
  todoCounts?: {
    categories: Record<string, number>;
    priorities: Record<string, number>;
    statuses: Record<string, number>;
  };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FiltersModal({
  filters,
  setFilters,
  clearFilters,
  activeFiltersCount,
  totalTodos = 0,
  todoCounts,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: FiltersModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    status: false,
    categories: false,
    priorities: false,
  });

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const filteredCategories = useMemo(() => {
    return CATEGORIES.filter((category) =>
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category];
      setFilters({ categories: newCategories });
    },
    [filters.categories, setFilters]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters({ status: status as "all" | "pending" | "completed" });
    },
    [setFilters]
  );

  const handlePriorityToggle = useCallback(
    (priority: string) => {
      const newPriorities = filters.priorities?.includes(priority)
        ? filters.priorities.filter((p) => p !== priority)
        : [...(filters.priorities || []), priority];
      setFilters({ priorities: newPriorities });
    },
    [filters.priorities, setFilters]
  );

  const handleClearAll = useCallback(() => {
    clearFilters();
    setIsOpen(false);
  }, [clearFilters, setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open) {
        // Reset all sections to closed when modal opens
        setExpandedSections({
          status: false,
          categories: false,
          priorities: false,
        });
        // Clear category search when opening
        setCategorySearch("");
      }
    },
    [setIsOpen]
  );

  const handleSelectAll = useCallback(
    (type: "categories" | "priorities") => {
      if (type === "categories") {
        const allSelected = CATEGORIES.every((cat) =>
          filters.categories.includes(cat)
        );
        setFilters({
          categories: allSelected ? [] : [...CATEGORIES],
        });
      } else if (type === "priorities") {
        const allSelected = PRIORITY_CONFIG.every((p) =>
          filters.priorities?.includes(p.value)
        );
        setFilters({
          priorities: allSelected ? [] : PRIORITY_CONFIG.map((p) => p.value),
        });
      }
    },
    [filters, setFilters]
  );

  const removeFilter = useCallback(
    (type: string, value?: string) => {
      switch (type) {
        case "status":
          setFilters({ status: "all" });
          break;
        case "category":
          if (value) handleCategoryToggle(value);
          break;
        case "priority":
          if (value) handlePriorityToggle(value);
          break;
      }
    },
    [setFilters, handleCategoryToggle, handlePriorityToggle]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={activeFiltersCount > 0 ? "default" : "outline"}
          className={cn(
            "h-10 px-4 transition-all duration-200",
            activeFiltersCount > 0
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-background hover:bg-muted border-input hover:border-primary/50"
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-background text-foreground font-semibold"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden sm:w-full">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-semibold truncate">
                  Filter Todos
                </DialogTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 hidden sm:block">
                  {totalTodos > 0
                    ? `Refine your ${totalTodos} todo${
                        totalTodos !== 1 ? "s" : ""
                      } with advanced filtering`
                    : "Set up filters to organize your todos"}
                </p>
              </div>
            </div>
            {/* {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors flex-shrink-0 ml-2"
              >
                <X className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Clear all</span>
              </Button>
            )} */}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("status")}
                className="flex items-center justify-between w-full group p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <label className="text-base font-semibold text-foreground flex items-center gap-2 cursor-pointer">
                  Status Filter
                  {filters.status !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      1 selected
                    </Badge>
                  )}
                </label>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground",
                    expandedSections.status && "rotate-180"
                  )}
                />
              </button>

              {expandedSections.status && (
                <div className="pl-4 space-y-3">
                  <Select
                    value={filters.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="h-11 bg-background border-input hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_CONFIG.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                status.color
                              )}
                            />
                            <span>{status.label}</span>
                            {todoCounts?.statuses[status.value] && (
                              <Badge
                                variant="outline"
                                className="text-xs ml-auto"
                              >
                                {todoCounts.statuses[status.value]}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between w-full group">
                <button
                  onClick={() => toggleSection("categories")}
                  className="flex items-center gap-2 cursor-pointer p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors flex-1"
                >
                  <label className="text-base font-semibold text-foreground flex items-center gap-2 cursor-pointer">
                    Categories
                    {filters.categories.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {filters.categories.length} selected
                      </Badge>
                    )}
                  </label>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground",
                      expandedSections.categories && "rotate-180"
                    )}
                  />
                </button>
                {filters.categories.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ categories: [] })}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {expandedSections.categories && (
                <div className="pl-2 sm:pl-4 space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-10 h-9 bg-background"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll("categories")}
                      className="h-9 px-3 text-xs whitespace-nowrap w-full sm:w-auto"
                    >
                      {CATEGORIES.every((cat) =>
                        filters.categories.includes(cat)
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  <div className="border border-input rounded-lg bg-background/50">
                    <ScrollArea className="h-40 sm:h-48">
                      <div className="p-2 sm:p-3 space-y-1">
                        {filteredCategories.map((category) => (
                          <label
                            key={category}
                            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-muted/60 rounded-lg p-2 sm:p-3 transition-all duration-200 group"
                          >
                            <Checkbox
                              checked={filters.categories.includes(category)}
                              onCheckedChange={() =>
                                handleCategoryToggle(category)
                              }
                              className="h-4 w-4 transition-all flex-shrink-0"
                            />
                            <span className="text-sm font-medium flex-1 group-hover:text-foreground truncate">
                              {category}
                            </span>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              {todoCounts?.categories[category] && (
                                <Badge
                                  variant="outline"
                                  className="text-xs hidden sm:inline-flex"
                                >
                                  {todoCounts.categories[category]}
                                </Badge>
                              )}
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs px-1.5 sm:px-2 py-0.5 truncate max-w-16 sm:max-w-none",
                                  CATEGORY_COLORS[
                                    category as keyof typeof CATEGORY_COLORS
                                  ]
                                )}
                              >
                                <span className="hidden sm:inline">
                                  {category}
                                </span>
                                <span className="sm:hidden">
                                  {category.charAt(0)}
                                </span>
                              </Badge>
                            </div>
                          </label>
                        ))}
                        {filteredCategories.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No categories found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>

            <Separator />

      
            <div className="space-y-4">
              <div className="flex items-center justify-between w-full group">
                <button
                  onClick={() => toggleSection("priorities")}
                  className="flex items-center gap-2 cursor-pointer p-2 -m-2 rounded-lg hover:bg-muted/50 transition-colors flex-1"
                >
                  <label className="text-base font-semibold text-foreground flex items-center gap-2 cursor-pointer">
                    Priority Level
                    {filters.priorities && filters.priorities.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {filters.priorities.length} selected
                      </Badge>
                    )}
                  </label>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground",
                      expandedSections.priorities && "rotate-180"
                    )}
                  />
                </button>
                {filters.priorities && filters.priorities.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({ priorities: [] })}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {expandedSections.priorities && (
                <div className="pl-2 sm:pl-4 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll("priorities")}
                      className="h-8 px-3 text-xs w-full sm:w-auto"
                    >
                      {PRIORITY_CONFIG.every((p) =>
                        filters.priorities?.includes(p.value)
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {PRIORITY_CONFIG.map((priority) => {
                      const Icon = priority.icon;
                      return (
                        <label
                          key={priority.value}
                          className={cn(
                            "flex items-center space-x-2 sm:space-x-3 cursor-pointer rounded-lg p-3 sm:p-4 transition-all duration-200 group border",
                            filters.priorities?.includes(priority.value)
                              ? `${priority.bg} ${priority.border}`
                              : "border-border hover:bg-muted/50 hover:border-border"
                          )}
                        >
                          <Checkbox
                            checked={
                              filters.priorities?.includes(priority.value) ||
                              false
                            }
                            onCheckedChange={() =>
                              handlePriorityToggle(priority.value)
                            }
                            className="h-4 w-4 flex-shrink-0"
                          />
                          <div
                            className={cn(
                              "p-1 sm:p-1.5 rounded-md flex-shrink-0",
                              filters.priorities?.includes(priority.value)
                                ? priority.bg
                                : "bg-muted"
                            )}
                          >
                            <Icon className={cn("h-3 w-3", priority.color)} />
                          </div>
                          <span className="text-sm font-medium flex-1 truncate">
                            {priority.label}
                          </span>
                          {todoCounts?.priorities[priority.value] && (
                            <Badge
                              variant="outline"
                              className="text-xs flex-shrink-0 hidden sm:inline-flex"
                            >
                              {todoCounts.priorities[priority.value]}
                            </Badge>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            
            {activeFiltersCount > 0 && (
              <>
                <Separator />
                <div className="space-y-3 sm:space-y-4">
                  <label className="text-sm sm:text-base font-semibold text-foreground">
                    Active Filters ({activeFiltersCount})
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {filters.status !== "all" && (
                      <Badge
                        variant="secondary"
                        className="gap-1 sm:gap-2 py-1 px-2 sm:px-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Status: </span>
                        {filters.status}
                        <button
                          onClick={() => removeFilter("status")}
                          className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="gap-1 sm:gap-2 py-1 px-2 sm:px-3 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors text-xs sm:text-sm"
                      >
                        {category}
                        <button
                          onClick={() => removeFilter("category", category)}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {filters.priorities?.map((priority) => (
                      <Badge
                        key={priority}
                        variant="secondary"
                        className="gap-1 sm:gap-2 py-1 px-2 sm:px-3 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">
                          {priority} priority
                        </span>
                        <span className="sm:hidden">{priority}</span>
                        <button
                          onClick={() => removeFilter("priority", priority)}
                          className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

    
        <DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-muted/30 gap-2 sm:gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              {activeFiltersCount > 0
                ? `${activeFiltersCount} filter${
                    activeFiltersCount !== 1 ? "s" : ""
                  } applied`
                : "No filters applied"}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="px-4 sm:px-6 h-9 sm:h-10"
              >
                Close
              </Button>
              {activeFiltersCount > 0 ? (
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                  className="px-4 sm:px-6 h-9 sm:h-10"
                >
                  <span className="hidden sm:inline">Clear All Filters</span>
                  <span className="sm:hidden">Clear All</span>
                </Button>
              ) : (
                <Button
                  onClick={handleClose}
                  className="px-4 sm:px-6 h-9 sm:h-10"
                >
                  Apply Filters
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
