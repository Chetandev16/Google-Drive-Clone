"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "keep-react";
import { CaretRight } from "phosphor-react";
import { map } from "lodash";

interface Props {
  breadcrumb: string[];
}

const BreadcrumbComponent: React.FC<Props> = ({ breadcrumb }) => {
  const router = useRouter();

  const onClickOfBreadcrumb = (id: string | null) => {
    if (id == null) {
      router.push("/dashboard/home");
      return;
    }
    router.push(`/dashboard/home/folder/${id}`);
  };

  return (
    <Breadcrumb
      aria-label="Default breadcrumb example"
      separatorIcon={<CaretRight size={20} color="#AFBACA" />}
    >
      {map(breadcrumb, (item: { name: string; id: string | null }, key) => {
        if (key === breadcrumb.length - 1) {
          return (
            <Breadcrumb.Item
              onClick={() => onClickOfBreadcrumb(item.id)}
              key={key}
              active="base"
              className="cursor-default"
            >
              {item.name}
            </Breadcrumb.Item>
          );
        }
        return (
          <Breadcrumb.Item
            onClick={() => onClickOfBreadcrumb(item.id)}
            key={key}
            className="cursor-pointer"
          >
            {item.name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
