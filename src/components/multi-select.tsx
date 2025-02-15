"use client";

import { useOutSideClick } from "@/hooks/useOutSideClick";
import { cn } from "@/utils";
import { useRef, useState } from "react";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Label } from "./label";
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  options: Option[];
  label: string;
  name: TName;
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  isLoading?: boolean;
  error?: string;
  withLabel?: boolean;
}

export default function MultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  options,
  label,
  name,
  register,
  setValue,
  watch,
  isLoading = false,
  error,
  withLabel = true,
}: MultiSelectProps<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValues = (watch(name) as PathValue<TFieldValues, TName>) ?? [];
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutSideClick(wrapperRef, () => setIsOpen(false), isOpen, false);

  const handleToggle = (optionId: string) => {
    let newValues: string[];
    if (selectedValues.includes(optionId as PathValue<TFieldValues, TName>)) {
      newValues = selectedValues.filter((id) => id !== optionId);
    } else {
      newValues = [...selectedValues, optionId];
    }
    setValue(name, newValues as PathValue<TFieldValues, TName>, {
      shouldValidate: true,
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {withLabel && <Label htmlFor={name}>{label}</Label>}
      <div className={cn(withLabel && "mt-1")}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="border-input flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : `Select ${label}`}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-150 ease-in-out",
              isOpen ? "rotate-180 transform" : "",
            )}
          />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {isLoading ? (
              <div className="px-4 py-2 text-gray-900">Loading...</div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.id}
                  className="relative flex cursor-default select-none items-center px-4 py-2 text-gray-900 hover:bg-indigo-600 hover:text-white"
                  onClick={() => handleToggle(option.id)}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={selectedValues.includes(
                      option.id as PathValue<TFieldValues, TName>,
                    )}
                    readOnly
                  />
                  <span className="ml-3 block truncate">{option.name}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-900">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <input type="hidden" {...register(name)} />
    </div>
  );
}
