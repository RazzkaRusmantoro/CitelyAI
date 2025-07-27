import { Document, Page, Text, View } from "@react-pdf/renderer";

export const PDFDocument = () => {
    return (
        <Document title = {`Resume Document`} >
            <Page size = "A4">
                <View>
                    <Text>Hello world</Text>
                </View>
            </Page>
        </Document>
    );
}