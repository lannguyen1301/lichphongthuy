// scss/components/_converter-modal.scss
@use "../abstracts" as abs;

.converter-modal {
    @extend %fixedCover;
    z-index: 90;
    @extend %flexCenter;
    padding: 1.6rem;

    &[hidden] {
        display: none !important;
    }

    &__backdrop {
        @extend %absCover;
        background-color: var(--overlay-bg);
        backdrop-filter: blur(4px);
    }

    &__dialog {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 56rem;
        max-height: calc(100vh - 3.2rem);
        overflow-y: auto;
        padding: 2.4rem;
        background-color: var(--body-bg);
        border: 1.5px solid var(--primary-color);
        border-radius: 2.4rem;
        box-shadow: 0 2rem 4.8rem var(--shadow-color);
        @extend %flexColumn;
        gap: 1.8rem;
        @extend %animDropdownFadeIn;
        @extend %transTheme;

        @include abs.screen(sm) {
            padding: 1.6rem;
            border-radius: 1.8rem;
            gap: 1.4rem;
        }
    }

    &__header {
        @extend %flexBetween;
        gap: 1.2rem;
    }

    &__title-wrap {
        @extend %flexColumn;
        gap: 0.3rem;
    }

    &__badge {
        display: inline-block;
        width: fit-content;
        padding: 0.25rem 0.9rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 99.9rem;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    &__title {
        font-size: 2.2rem;
        font-weight: 800;
        color: var(--text-color);

        @include abs.screen(sm) {
            font-size: 1.85rem;
        }
    }

    &__close-btn {
        @extend %inlineFlexCenter;
        width: 4rem;
        height: 4rem;
        border-radius: 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--text-muted);
        @extend %transInteractive;

        &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: rotate(90deg);
        }
    }

    &__tabs {
        @extend %gridCols2;
        gap: 0.8rem;
        padding: 0.5rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 1.4rem;
    }

    &__tab {
        @extend %inlineFlexCenter;
        height: 4rem;
        padding: 0 1.2rem;
        border-radius: 1rem;
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--text-muted);
        @extend %transTheme;

        &:hover {
            color: var(--text-color);
        }

        &.is-active {
            background-color: var(--primary-color);
            color: #ffffff;
            box-shadow: 0 0.4rem 1.2rem var(--shadow-color);
        }
    }

    &__form {
        @extend %flexColumn;
        gap: 1rem;
    }

    &__inputs {
        @extend %gridCols3;
        gap: 1rem;

        @include abs.screen(sm) {
            gap: 0.6rem;
        }
    }

    &__field {
        @extend %flexColumn;
        gap: 0.5rem;
    }

    &__label {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-muted);
    }

    &__select {
        height: 4.4rem;
        padding: 0 1.2rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 1.2rem;
        font-size: 1.45rem;
        font-weight: 700;
        color: var(--text-color);
        cursor: pointer;
        @extend %transTheme;

        &:hover,
        &:focus-visible {
            border-color: var(--primary-color);
        }
    }

    &__leap-row {
        padding: 0.8rem 1.2rem;
        background-color: var(--bg-surface);
        border: 1px dashed var(--primary-color);
        border-radius: 1rem;

        &[hidden] {
            display: none !important;
        }
    }

    &__leap-label {
        @extend %flexItemCenter;
        gap: 0.8rem;
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--text-color);
        cursor: pointer;
    }

    &__checkbox {
        width: 1.8rem;
        height: 1.8rem;
        accent-color: var(--primary-color);
        cursor: pointer;
    }

    &__result {
        @extend %flexColumn;
        gap: 1.2rem;
        padding: 1.6rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: 1.8rem;
    }

    &__result-main {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 1rem;

        @include abs.screen(sm) {
            grid-template-columns: 1fr;
        }
    }

    &__result-box {
        @extend %flexColumnCenterAll;
        gap: 0.3rem;
        padding: 1.2rem 1rem;
        background-color: var(--body-bg);
        border: 1px solid var(--border-color);
        border-radius: 1.4rem;
        text-align: center;

        &--lunar {
            border-color: var(--primary-color);
        }
    }

    &__result-tag {
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
    }

    &__result-num {
        font-size: 2.2rem;
        font-weight: 800;
        color: var(--primary-color);
        font-variant-numeric: tabular-nums;
    }

    &__result-sub {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-color);
    }

    &__result-arrow {
        @extend %inlineFlexCenter;
        width: 3.4rem;
        height: 3.4rem;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: 800;
        margin: 0 auto;
    }

    &__meta-grid {
        @extend %gridCols2;
        gap: 0.8rem;

        @include abs.screen(sm) {
            grid-template-columns: 1fr;
        }
    }

    &__meta-item {
        @extend %flexBetween;
        gap: 0.8rem;
        padding: 0.8rem 1.2rem;
        background-color: var(--body-bg);
        border: 1px solid var(--border-color);
        border-radius: 1rem;
        font-size: 1.3rem;

        span {
            color: var(--text-muted);
        }

        strong {
            color: var(--text-color);
            font-weight: 700;
        }
    }

    &__fortune-bar {
        padding: 1rem 1.2rem;
        background-color: var(--body-bg);
        border-left: 4px solid var(--primary-color);
        border-radius: 0.8rem;
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.45;
        color: var(--text-color);
    }

    &__footer {
        @extend %flexBetween;
        gap: 1rem;

        @include abs.screen(sm) {
            flex-direction: column;

            .btn {
                width: 100%;
            }
        }
    }

    &__today-btn {
        height: 4.4rem;
        padding: 0 1.8rem;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        color: var(--text-color);

        &:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
    }

    &__jump-btn {
        @extend %flexItemFluid;
        height: 4.4rem;
        padding: 0 2rem;
        background-color: var(--primary-color);
        color: #ffffff;
        box-shadow: 0 0.6rem 1.6rem var(--shadow-color);

        &:hover {
            background-color: var(--primary-hover);
            transform: translateY(-1px);
        }
    }
}