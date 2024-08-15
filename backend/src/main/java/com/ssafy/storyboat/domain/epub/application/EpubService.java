package com.ssafy.storyboat.domain.epub.application;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EpubService {

    public byte[] createEpub(String title, String content) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipArchiveOutputStream zipOut = new ZipArchiveOutputStream(baos)) {

            // Add mimetype file
            ZipArchiveEntry mimetypeEntry = new ZipArchiveEntry("mimetype");
            zipOut.putArchiveEntry(mimetypeEntry);
            zipOut.write("application/epub+zip".getBytes(StandardCharsets.UTF_8));
            zipOut.closeArchiveEntry();

            // Add container.xml
            ZipArchiveEntry containerEntry = new ZipArchiveEntry("META-INF/container.xml");
            zipOut.putArchiveEntry(containerEntry);
            String containerXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                    + "<container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">"
                    + "<rootfiles><rootfile full-path=\"OEBPS/content.xhtml\" media-type=\"application/xhtml+xml\"/></rootfiles>"
                    + "</container>";
            zipOut.write(containerXml.getBytes(StandardCharsets.UTF_8));
            zipOut.closeArchiveEntry();

            // Add content.xhtml
            ZipArchiveEntry contentEntry = new ZipArchiveEntry("OEBPS/content.xhtml");
            zipOut.putArchiveEntry(contentEntry);
            String contentXhtml = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><title>" + title + "</title></head><body><h1>" + title + "</h1><p>"
                    + content + "</p></body></html>";
            zipOut.write(contentXhtml.getBytes(StandardCharsets.UTF_8));
            zipOut.closeArchiveEntry();

            // Add content.opf
            ZipArchiveEntry opfEntry = new ZipArchiveEntry("OEBPS/content.opf");
            zipOut.putArchiveEntry(opfEntry);
            String contentOpf = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                    + "<package xmlns=\"http://www.idpf.org/2007/opf\" version=\"2.0\">"
                    + "<metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\">"
                    + "<dc:title>" + title + "</dc:title><dc:creator>Author Name</dc:creator>"
                    + "<dc:identifier id=\"book-id\">unique-id</dc:identifier></metadata>"
                    + "<manifest><item id=\"item1\" href=\"content.xhtml\" media-type=\"application/xhtml+xml\"/></manifest>"
                    + "<spine><itemref idref=\"item1\"/></spine></package>";
            zipOut.write(contentOpf.getBytes(StandardCharsets.UTF_8));
            zipOut.closeArchiveEntry();

            // Add toc.ncx
            ZipArchiveEntry tocEntry = new ZipArchiveEntry("OEBPS/toc.ncx");
            zipOut.putArchiveEntry(tocEntry);
            String tocNcx = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                    + "<ncx xmlns=\"http://www.daisy.org/z3986/2005/ncx/\" version=\"2005-1\">"
                    + "<head><meta name=\"dtb:uid\" content=\"unique-id\"/></head>"
                    + "<docTitle><title>" + title + "</title></docTitle>"
                    + "<navMap><navPoint id=\"navPoint-1\" playOrder=\"1\">"
                    + "<navLabel><text>" + title + "</text></navLabel>"
                    + "<content src=\"content.xhtml\"/></navPoint></navMap></ncx>";
            zipOut.write(tocNcx.getBytes(StandardCharsets.UTF_8));
            zipOut.closeArchiveEntry();

            zipOut.finish();
            return baos.toByteArray();
        }
    }
}
