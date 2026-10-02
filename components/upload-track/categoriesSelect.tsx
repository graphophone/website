"use client"

import { searchCategoriesEndpoint } from "@/constants/api";
import { isRequestError } from "@/lib/error";
import { CategoryData } from "@/types/category/category";
import { useEffect, useState } from "react";
import DebouncedSearch from "../debouncedSearch";
import { Badge } from "../ui/badge";
import { Check, X } from "phosphor-react";
import { Card, CardContent } from "../ui/card";
import { Spinner } from "../ui/spinner";

function CategoriesSelect() {
  const limit = 3;
  const [popupTimeout, setPopupTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const searchCategories = async (searchToken: string) => {
    if (!isPopupOpen) {
      return;
    }
    setIsCategoriesLoading(true);
    const base = "http://text";
    const url = new URL(searchCategoriesEndpoint, base);
    url.searchParams.append("searchToken", searchToken);
    const requestUrl = url.toString().slice(base.length);
    const res = await fetch(requestUrl, {
      method: "GET",
    });
    if (!isRequestError(res)) {
      const categories: CategoryData[] = await res.json();
      setCategories(categories);
    } else {
      setCategories([]);
      console.log('error');
    }
    setIsCategoriesLoading(false);
  };

  useEffect(() => {
    if (!isPopupOpen) {
      setCategories([]);
    }
  }, [isPopupOpen]);

  useEffect(() => {
    return () => {
      if (popupTimeout) {
        clearTimeout(popupTimeout);
        setPopupTimeout(null);
      }
    }
  }, []);

  const closePopup = () => {
    if (popupTimeout) {
      clearTimeout(popupTimeout);
      setPopupTimeout(null);
    }
    setPopupTimeout(setTimeout(() => {
      setIsPopupOpen(false);
      setPopupTimeout(null);
    }, 50));
  }
  
  const openPopup = () => {
    if (popupTimeout) {
      clearTimeout(popupTimeout);
      setPopupTimeout(null);
    }
    setIsPopupOpen(true);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full relative flex flex-col gap-2">
        <DebouncedSearch
          className="w-full"
          onClick={openPopup}
          onBlur={closePopup}
          request={searchCategories}
          isLoading={isCategoriesLoading}
        />

        { isPopupOpen ?
          <Card
            className="z-10 w-full absolute rounded-[8px] top-full mt-px"
            onClick={openPopup}
          >
            <CardContent>
              { isCategoriesLoading ?
                <div className="w-full h-full flex justify-center items-center">
                  <Spinner className="size-16" />
                </div> :
                categories.length === 0 ?
                  <div className="flex justify-center items-center w-full p-4">No results</div> :
                  <div className="flex flex-col">
                    { categories.map((category, i) => (
                      <CategoryItem
                        key={i}
                        category={category}
                        clickCallback={() => {
                          if (selectedCategories.some(c => c.id === category.id)) {
                            setSelectedCategories(prev => prev.filter(c => c.id !== category.id));
                          } else if (selectedCategories.length < limit) {
                            setSelectedCategories(prev => [ ...prev, { ...category } ])
                          }
                        }}
                        isDisabled={selectedCategories.length >= limit}
                        isSelected={selectedCategories.some(c => c.id === category.id)}
                      />
                    )) }
                  </div>
              }
            </CardContent>
          </Card> : <></>
        }
      </div>
      
      <div className="w-full">
        {selectedCategories.map((category, i) => (
          <CategoryBadge
            category={category}
            removeCallback={() => {
              setSelectedCategories(prev => prev.filter(c => c.id !== category.id));
            }}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

interface CategoryItemParams {
  category: CategoryData,
  isDisabled: boolean,
  isSelected: boolean,
  clickCallback: () => void,
}

function CategoryItem({
  category,
  clickCallback,
  isDisabled,
  isSelected,
}: CategoryItemParams) {
  return (
    <div
      className={`w-full px-6 py-2 flex justify-between items-center
        transition-colors bg-foreground/0 ${ isDisabled ? 'opacity-50' :
          'cursor-pointer hover:bg-foreground/15' }`}
      aria-disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          clickCallback();
        }
      }}
    >
      { category.name }
      { isSelected ? <Check /> : <></> }
    </div>
  )
}

interface CategoryBadgeParams {
  category: CategoryData,
  removeCallback: () => void,
}

function CategoryBadge({ category, removeCallback }: CategoryBadgeParams) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Badge
      variant="secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      { category.name }
      { isHovered ?
        <X onClick={() => removeCallback()} /> : <></>
      }
    </Badge>
  )
}

export default CategoriesSelect