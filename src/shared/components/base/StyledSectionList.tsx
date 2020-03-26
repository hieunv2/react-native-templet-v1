import React, {useRef, useState} from 'react'
import {ActivityIndicator, RefreshControl, SectionList, SectionListProps, View} from 'react-native'
import {Themes} from '../../../assets/themes'
import NoData from './StyledNoData'

interface Props extends SectionListProps<any> {
    [key: string]: any

    loading?: boolean
    sections: any[]
    noDataText?: string
    ListHeaderComponent?: any
    scrollEnabled?: boolean
    noDataRefreshable?: boolean

    customStyle?: any

    onLoadMore?(): void

    onNoDataRefresh?(): void
}

const StyledSectionList = (props: Props) => {
    const [momentumScrolled, setMomentumScrolled] = useState(false)
    const list: any = useRef(null)

    const {loading, sections, ListHeaderComponent, refreshing, customStyle} = props
    const contentContainerStyle: any = {}
    const hasData = sections.length !== 0
    if (!hasData) {
        contentContainerStyle.flex = 1
        contentContainerStyle.alignItems = 'center'
        contentContainerStyle.justifyContent = 'center'
    }
    let styles
    if (typeof ListHeaderComponent === 'undefined' && !hasData) {
        styles = [contentContainerStyle, customStyle]
    } else {
        styles = customStyle
    }

    function keyExtractor(item: any, i: any): string {
        return `${i.toString()}`
    }

    function handleRefresh() {
        props.onRefresh && props.onRefresh()
    }

    function handleEndReached(info: any) {
        if (!momentumScrolled) {
            props.onLoadMore && props.onLoadMore()
            setMomentumScrolled(true)
        }
    }

    function handleNoDataRefresh() {
        const {onNoDataRefresh} = props
        onNoDataRefresh?.()
    }

    function onMomentumScrollBegin() {
        setMomentumScrolled(false)
    }

    function scrollToFooter() {
        list?.scrollToEnd({animated: true})
    }

    function scrollToTop() {
        list?.scrollTo({y: 0, animated: true})
    }
    function scrollTo(index: number, animated?: boolean) {
        list?.scrollToIndex({index, animated})
    }

    function renderFooter() {
        if (hasData && loading !== undefined && !!loading) {
            return (
                <View style={{alignItems: 'center', marginVertical: 8}}>
                    <ActivityIndicator />
                </View>
            )
        }
        return null
    }

    function renderNoData() {
        const {noDataText, noDataRefreshable} = props
        return (
            <NoData
                loading={loading}
                text={noDataText}
                refreshable={noDataRefreshable}
                onRefresh={handleNoDataRefresh}
            />
        )
    }

    return (
        <SectionList
            ref={list}
            contentContainerStyle={styles}
            sections={sections || []}
            stickySectionHeadersEnabled={true}
            keyExtractor={keyExtractor}
            initialNumToRender={1}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={onMomentumScrollBegin}
            ListEmptyComponent={renderNoData}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            refreshing={!!refreshing}
            refreshControl={
                <RefreshControl
                    refreshing={!!refreshing}
                    colors={[Themes.COLORS.primary]}
                    tintColor={Themes.COLORS.primary}
                    onRefresh={handleRefresh}
                />
            }
            keyboardShouldPersistTaps={'handled'}
            {...props}
        />
    )
}

export default React.memo(StyledSectionList)