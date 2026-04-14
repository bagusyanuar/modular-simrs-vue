<script setup lang="ts">
import { computed } from 'vue';
import { RangeCalendarRoot, useForwardPropsEmits } from 'reka-ui';
import type { RangeCalendarRootEmits, RangeCalendarRootProps } from 'reka-ui';
import NRangeCalendarHeader from './NRangeCalendarHeader.vue';
import NRangeCalendarHeading from './NRangeCalendarHeading.vue';
import NRangeCalendarPrev from './NRangeCalendarPrev.vue';
import NRangeCalendarNext from './NRangeCalendarNext.vue';
import NRangeCalendarGrid from './NRangeCalendarGrid.vue';
import NRangeCalendarGridHead from './NRangeCalendarGridHead.vue';
import NRangeCalendarGridBody from './NRangeCalendarGridBody.vue';
import NRangeCalendarGridRow from './NRangeCalendarGridRow.vue';
import NRangeCalendarHeadCell from './NRangeCalendarHeadCell.vue';
import NRangeCalendarCell from './NRangeCalendarCell.vue';
import NRangeCalendarCellTrigger from './NRangeCalendarCellTrigger.vue';
import { calendarVariants } from './ncalendar.variants';

interface Props extends RangeCalendarRootProps {
  class?: string;
}

const props = defineProps<Props>();
const emits = defineEmits<RangeCalendarRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const rootClass = computed(() => calendarVariants({ class: props.class }));
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    v-bind="forwarded"
    :class="rootClass"
  >
    <NRangeCalendarHeader>
      <NRangeCalendarPrev />
      <NRangeCalendarHeading />
      <NRangeCalendarNext />
    </NRangeCalendarHeader>

    <div
      class="flex flex-col space-y-4 pt-1 sm:flex-row sm:space-x-4 sm:space-y-0 text-center"
    >
      <NRangeCalendarGrid v-for="month in grid" :key="month.value.toString()">
        <NRangeCalendarGridHead>
          <NRangeCalendarGridRow>
            <NRangeCalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </NRangeCalendarHeadCell>
          </NRangeCalendarGridRow>
        </NRangeCalendarGridHead>
        <NRangeCalendarGridBody>
          <NRangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
          >
            <NRangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <NRangeCalendarCellTrigger :day="weekDate" :month="month.value" />
            </NRangeCalendarCell>
          </NRangeCalendarGridRow>
        </NRangeCalendarGridBody>
      </NRangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
