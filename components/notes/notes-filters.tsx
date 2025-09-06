"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X, Search } from "lucide-react";
import { useNoteStore } from "@/lib/stores/note-store";

const CATEGORIES = [
  "Work",
  "Health",
  "Finance",
  "Travel",
  "Personal",
  "Education",
  "Shopping",
  "Daily",
  "Ideas",
  "Meeting",
  "Project",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function NotesFilters() {
  const { filters, setFilters, clearFilters, notes } = useNoteStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFilters({
        categories: [...filters.categories, category],
      });
    } else {
      setFilters({
        categories: filters.categories.filter((c) => c !== category),
      });
    }
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setFilters({
        priorities: [...filters.priorities, priority],
      });
    } else {
      setFilters({
        priorities: filters.priorities.filter((p) => p !== priority),
      });
    }
  };

  const handlePinnedChange = (value: string) => {
    setFilters({
      isPinned: value === "all" ? null : value === "pinned",
    });
  };

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.isPinned !== null) count++;
    if (filters.search.trim()) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Notes</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
      
            <div className="space-y-2">
              <label className="text-sm font-medium">Pinned Status</label>
              <Select
                value={
                  filters.isPinned === null
                    ? "all"
                    : filters.isPinned
                    ? "pinned"
                    : "unpinned"
                }
                onValueChange={handlePinnedChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pinned status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="pinned">Pinned Only</SelectItem>
                  <SelectItem value="unpinned">Unpinned Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

   
            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priorities</label>
              <div className="space-y-2">
                {PRIORITIES.map((priority) => (
                  <div
                    key={priority.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`priority-${priority.value}`}
                      checked={filters.priorities.includes(priority.value)}
                      onCheckedChange={(checked) =>
                        handlePriorityChange(priority.value, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`priority-${priority.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {priority.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Active Filters</label>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() =>
                          setFilters({
                            categories: filters.categories.filter(
                              (c) => c !== category
                            ),
                          })
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {filters.priorities.map((priority) => (
                    <Badge
                      key={priority}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {priority}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() =>
                          setFilters({
                            priorities: filters.priorities.filter(
                              (p) => p !== priority
                            ),
                          })
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {filters.isPinned !== null && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {filters.isPinned ? "Pinned" : "Unpinned"}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => setFilters({ isPinned: null })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}

      
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
              <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
