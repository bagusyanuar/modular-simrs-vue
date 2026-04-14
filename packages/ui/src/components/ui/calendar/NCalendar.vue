<script setup lang="ts">
import { computed } from 'vue';
import { CalendarRoot, useForwardPropsEmits } from 'reka-ui';
import type { CalendarRootEmits, CalendarRootProps } from 'reka-ui';
import NCalendarHeader from './NCalendarHeader.vue';
import NCalendarHeading from './NCalendarHeading.vue';
import NCalendarPrev from './NCalendarPrev.vue';
import NCalendarNext from './NCalendarNext.vue';
import NCalendarGrid from './NCalendarGrid.vue';
import NCalendarGridHead from './NCalendarGridHead.vue';
import NCalendarGridBody from './NCalendarGridBody.vue';
import NCalendarGridRow from './NCalendarGridRow.vue';
import NCalendarHeadCell from './NCalendarHeadCell.vue';
import NCalendarCell from './NCalendarCell.vue';
import NCalendarCellTrigger from './NCalendarCellTrigger.vue';
import { calendarVariants } from './ncalendar.variants';

interface Props extends CalendarRootProps {
  class?: string;
}

const props = defineProps<Props>();
const emits = defineEmits<CalendarRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);

const rootClass = computed(() => calendarVariants({ class: props.class }));
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays }"
    v-bind="forwarded"
    :class="rootClass"
  >
    <NCalendarHeader>
      <NCalendarPrev />
      <NCalendarHeading />
      <NCalendarNext />
    </NCalendarHeader>

    <div
      class="flex flex-col space-y-4 pt-1 sm:flex-row sm:space-x-4 sm:space-y-0 text-center"
    >
      <NCalendarGrid v-for="month in grid" :key="month.value.toString()">
        <NCalendarGridHead>
          <NCalendarGridRow>
            <NCalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </NCalendarHeadCell>
          </NCalendarGridRow>
        </NCalendarGridHead>
        <NCalendarGridBody>
          <NCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
          >
            <NCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <NCalendarCellTrigger :day="weekDate" :month="month.value" />
            </NCalendarCell>
          </NCalendarGridRow>
        </NCalendarGridBody>
      </NCalendarGrid>
    </div>
  </CalendarRoot>
</template>
