"use client";

import React from 'react';
import { Input, Select, SelectItem, Textarea, Button } from "@heroui/react";
import { Upload, Info, HelpCircle, FileUp, Inbox } from 'lucide-react';
import Image from 'next/image';

interface MetadataFormProps {
  coverImage: string | null;
  onSubmit: (data: Record<string, unknown>) => void;
}

const MetadataForm = ({ coverImage }: MetadataFormProps) => {
  return (
    <div className="w-full space-y-2 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-white text-sm flex items-center gap-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input 
            placeholder="Fill in the title that will show up in your cards"
            aria-label='Title Input'
            className="text-white "
            classNames={{
              inputWrapper: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
            }}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-white text-sm flex items-center gap-1">
            Category <span className="text-red-500">*</span>
          </label>
          <Select
            aria-label='Category Select'
            placeholder="Select a category for your model"
            classNames={{
              trigger: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]",
              value: "text-white",
            }}
          >
            <SelectItem key="architecture" className='font-inter'>Architecture</SelectItem>
            <SelectItem key="structure" className='font-inter'>Structure</SelectItem>
            <SelectItem key="mep" className='font-inter'>MEP</SelectItem>
          </Select>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <label className="text-white text-sm block">Keywords</label>
        <Input 
          aria-label='Keywords Input'
          placeholder="Fill in some keywords that will help people find your model easily"
          classNames={{
            inputWrapper: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
          }}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-white text-sm flex items-center gap-2">
          Description <Info size={16} className="text-gray-400" />
        </label>
        <Textarea 
          aria-label='Description Textarea'
          placeholder="Please add some description for your model. You can also click the button to get a template"
          minRows={4}
          classNames={{
            inputWrapper: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
          }}
        />
      </div>

      {/* Images / Cover */}
      <div className="space-y-2 ">
        <label className="text-white text-sm flex items-center gap-2">
          Images <HelpCircle size={16} className="text-gray-400" />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 顯示擷取的封面圖 */}
          {coverImage && (
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]">
                <Image src={coverImage} alt='Cover' height={100} width={100} className='w-full h-full object-cover'/>
              {/* <img src={coverImage} alt="Cover" className="w-full h-full object-cover" /> */}
              <div className="absolute top-2 left-2 bg-[#D70036] text-white text-[10px] px-2 py-1 rounded">COVER</div>
            </div>
          )}
          
          {/* 上傳更多圖片區域 */}
          <div className="col-span-2  rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]">
            <FileUp size={32} className="text-gray-400" />
            <p className="text-white text-xs">Drop some images here or <span className="text-[#D70036]">browse</span></p>
            <p className="text-gray-500 text-[10px]">JPG/JPEG/PNG format, max 10M, max 8 images</p>
          </div>
        </div>
      </div>

      {/* Associated Model Set */}
      <div className="space-y-2">
        <label className="text-white text-sm flex items-center gap-2">
          Associated model set <HelpCircle size={16} className="text-gray-400" />
        </label>
        <div className="flex gap-2">
          <Select 
            aria-label='Associated Model Select'
            placeholder="None"
            className="flex-grow "
            classNames={{
              trigger: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
            }}
          >
            <SelectItem key="none">None</SelectItem>
          </Select>
          <Button className="px-3 bg-[#3F3F46] shadow-[0px_0px_2px_#000000B2,inset_0_-4px_4px_#00000040,inset_0_4px_2px_#FFFFFF33] text-white">
            Set Editor <Inbox size={25} className="w-[60%] h-[60%] ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permission Setting */}
        <div className="space-y-2">
          <label className="text-white text-sm block">Permission Setting</label>
          <Select 
            aria-label='Permission Setting Select'
            defaultSelectedKeys={["standard"]}
            classNames={{
              trigger: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
            }}
          >
            <SelectItem key="standard">Standard License</SelectItem>
            <SelectItem key="private">Private</SelectItem>
          </Select>
        </div>

        {/* Belonging Team */}
        <div className="space-y-2">
          <label className="text-white text-sm block">Belonging Team</label>
          <Select 
            aria-label='Belonging Team Select'
            placeholder="None"
            classNames={{
              trigger: "bg-[#18181B] shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
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