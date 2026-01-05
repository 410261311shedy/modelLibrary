"use client";

import React from 'react';
import { Input, Select, SelectItem, Textarea, Button } from "@heroui/react";
import { Upload, Info, HelpCircle } from 'lucide-react';

interface MetadataFormProps {
  coverImage: string | null;
  onSubmit: (data: Record<string, unknown>) => void;
}

const MetadataForm = ({ coverImage }: MetadataFormProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium flex items-center gap-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Fill in the title that will show up in your cards"
            aria-label='title input'
            variant="bordered"
            className="text-white"
            classNames={{
              inputWrapper: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]"
            }}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium flex items-center gap-1">
            Category <span className="text-red-500">*</span>
          </label>
          <Select 
            placeholder="Select a category for your model"
            variant="bordered"
            classNames={{
              trigger: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]",
              value: "text-white"
            }}
          >
            <SelectItem key="architecture">Architecture</SelectItem>
            <SelectItem key="structure">Structure</SelectItem>
            <SelectItem key="mep">MEP</SelectItem>
          </Select>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium">Keywords</label>
        <Input 
          placeholder="Fill in some keywords that will help people find your model easily"
          variant="bordered"
          classNames={{
            inputWrapper: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]"
          }}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium flex items-center gap-2">
          Description <Info size={16} className="text-gray-400" />
        </label>
        <Textarea 
          placeholder="Please add some description for your model. You can also click the button to get a template"
          variant="bordered"
          minRows={4}
          classNames={{
            inputWrapper: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]"
          }}
        />
      </div>

      {/* Images / Cover */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium flex items-center gap-2">
          Images <HelpCircle size={16} className="text-gray-400" />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 顯示擷取的封面圖 */}
          {coverImage && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#D70036]">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-[#D70036] text-white text-[10px] px-2 py-1 rounded">COVER</div>
            </div>
          )}
          
          {/* 上傳更多圖片區域 */}
          <div className="col-span-2 border-2 border-dashed border-[#FFFFFF33] rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-[#27272A] cursor-pointer hover:border-[#FFFFFF66] transition-colors">
            <Upload size={24} className="text-gray-400" />
            <p className="text-white text-xs">Drop some images here or <span className="text-[#D70036]">browse</span></p>
            <p className="text-gray-500 text-[10px]">JPG/JPEG/PNG format, max 10M, max 8 images</p>
          </div>
        </div>
      </div>

      {/* Associated Model Set */}
      <div className="space-y-2">
        <label className="text-white text-sm font-medium flex items-center gap-2">
          Associated model set <HelpCircle size={16} className="text-gray-400" />
        </label>
        <div className="flex gap-2">
          <Select 
            placeholder="None"
            variant="bordered"
            className="flex-grow"
            classNames={{
              trigger: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]"
            }}
          >
            <SelectItem key="none">None</SelectItem>
          </Select>
          <Button className="bg-[#3F3F46] text-white">Set Editor <Upload size={14} className="ml-1" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permission Setting */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Permission Setting</label>
          <Select 
            defaultSelectedKeys={["standard"]}
            variant="bordered"
            classNames={{
              trigger: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]"
            }}
          >
            <SelectItem key="standard">Standard License</SelectItem>
            <SelectItem key="private">Private</SelectItem>
          </Select>
        </div>

        {/* Belonging Team */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Belonging Team</label>
          <Select 
            placeholder="None"
            variant="bordered"
            classNames={{
              trigger: "bg-[#27272A] border-[#FFFFFF1A] hover:border-[#FFFFFF33]"
            }}
          >
            <SelectItem key="none">None</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MetadataForm;