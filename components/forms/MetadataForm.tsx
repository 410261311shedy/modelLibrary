"use client";

import React, { useState, useCallback } from 'react';
import { Input, Select, SelectItem, Textarea, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Slider } from "@heroui/react";
import { Upload, Info, HelpCircle, FileUp, Inbox } from 'lucide-react';
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage';
import Image from 'next/image';

export interface Metadata {
  title: string;
  category: string;
  keywords: string;
  description: string;
  permission: string;
  team: string;
  associatedModel: string;
}

interface MetadataFormProps {
  coverImage: string | null;
  onCoverChange: (image: string | null) => void;
  metadata: Metadata;
  onMetadataChange: (data: Metadata) => void;
}

const MetadataForm = ({ coverImage, onCoverChange, metadata, onMetadataChange }: MetadataFormProps) => {
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (coverImage && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(coverImage, croppedAreaPixels);
        onCoverChange(croppedImage); // 使用 onCoverChange 更新父層圖片
        setIsCropOpen(false); // 關閉 Modal
        setZoom(1); // 重置縮放
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleTextChange = (key: keyof Metadata, value: string) => {
    onMetadataChange({ ...metadata, [key]: value });
  };

  const handleSelectionChange = (key: keyof Metadata, keys: any) => {
    // NextUI 的 onSelectionChange 回傳的是 Set
    const value = Array.from(keys)[0] as string;
    onMetadataChange({ ...metadata, [key]: value || "" });
  };

  return (
    <div className="w-full space-y-2 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-white text-sm flex items-center gap-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={metadata.title}
            onValueChange={(v) => handleTextChange('title', v)}
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
            selectedKeys={metadata.category ? [metadata.category] : []}
            onSelectionChange={(k) => handleSelectionChange('category', k)}
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
          value={metadata.keywords}
          onValueChange={(v) => handleTextChange('keywords', v)}
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
          value={metadata.description}
          onValueChange={(v) => handleTextChange('description', v)}
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
            <div className="relative aspect-video rounded-xl group overflow-hidden shadow-[inset_0px_3px_5px_1px_#000000A3,inset_0px_-1px_2px_#00000099,0px_3px_1.8px_#FFFFFF29,0px_-2px_1.9px_#00000040,0px_0px_4px_#FBFBFB3D]"
              onClick={() => setIsCropOpen(true)}>
              <Image src={coverImage} alt='Cover' height={100} width={100} className='w-full h-full object-cover' />
              {/* <img src={coverImage} alt="Cover" className="w-full h-full object-cover" /> */}
              <div className="absolute top-2 left-2 bg-[#D70036] text-white text-[10px] px-2 py-1 rounded">COVER</div>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-white font-medium">點擊裁切圖片</span>
              </div>
            </div>
          )}
          <Modal isOpen={isCropOpen} onClose={() => setIsCropOpen(false)} size="2xl">
            <ModalContent className='bg-[#18181B] text-white'>
              <ModalHeader>裁切封面圖片</ModalHeader>
              <ModalBody>
                <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
                  {coverImage && (
                    <Cropper
                      image={coverImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1} // 固定 16:9 比例
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  )}
                </div>
                <div className="px-4 py-2">
                  <p className="text-small text-zinc-400 mb-2">縮放</p>
                  <Slider
                    aria-label="Zoom"
                    step={0.1}
                    minValue={1}
                    maxValue={3}
                    value={zoom}
                    onChange={(v) => setZoom(v as number)}
                    className="max-w-md"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={() => setIsCropOpen(false)}>
                  取消
                </Button>
                <Button className="bg-[#D70036] text-white" onPress={handleSaveCrop}>
                  確認裁切
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
            selectedKeys={metadata.associatedModel ? [metadata.associatedModel] : []}
            onSelectionChange={(k) => handleSelectionChange('associatedModel', k)}
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
            selectedKeys={metadata.permission ? [metadata.permission] : ["standard"]}
            onSelectionChange={(k) => handleSelectionChange('permission', k)}
            aria-label='Permission Setting Select'
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
            selectedKeys={metadata.team ? [metadata.team] : []}
            onSelectionChange={(k) => handleSelectionChange('team', k)}
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
