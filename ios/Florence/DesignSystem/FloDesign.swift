import SwiftUI
import CoreText

// =====================================================================
// Florence — design tokens. One source of truth. Nothing hardcodes a
// colour, size, font name, or spacing value anywhere else in the app.
// Values come straight from the token sheet. If a screen needs a value
// that isn't here, it gets added here first — never invented inline.
// =====================================================================

enum Flo {

    // MARK: Colour
    enum Colour {
        static let ground  = Color(hex: 0xFFFFFF)
        static let card    = Color(hex: 0xF4F1EA)
        static let ink     = Color(hex: 0x3A4436)
        static let inkSoft = Color(hex: 0x6A7265)
        static let accent  = Color(hex: 0x4A5340)
        static let sage    = Color(hex: 0x9BA184)
        static let line    = Color(hex: 0x3A4436, alpha: 0.13)   // ink at 13%
    }

    // MARK: Font families (registered from the bundled .ttf files)
    enum Family {
        static let display = "Playfair Display"   // headings, wordmark, her words
        static let body    = "Cormorant"          // all running copy
        // Small uppercase labels and buttons use the system sans (San Francisco).
    }

    // MARK: Spacing — 8pt scale, nothing in between
    enum Space {
        static let s1: CGFloat = 8
        static let s2: CGFloat = 16
        static let s3: CGFloat = 24
        static let s4: CGFloat = 32
        static let s5: CGFloat = 40
        static let s6: CGFloat = 48
        static let s7: CGFloat = 56
        static let s8: CGFloat = 64
    }

    // MARK: Frame padding — identical on every screen
    enum Frame {
        static let top: CGFloat = 56
        static let side: CGFloat = 32
        static let bottom: CGFloat = 48
        static var insets: EdgeInsets {
            EdgeInsets(top: top, leading: side, bottom: bottom, trailing: side)
        }
    }

    // MARK: Corners — square everywhere
    enum Corner { static let radius: CGFloat = 0 }

    // MARK: Type
    // trackingEm is stored as em (as in the sheet) and converted to points
    // at the given size on render. lineHeight is a multiple; SwiftUI applies
    // it as additive lineSpacing = size * (lineHeight - 1).
    struct TextStyle {
        enum Face { case display, body, labelSans }
        let face: Face
        let size: CGFloat
        let weight: Font.Weight
        let trackingEm: CGFloat
        let lineHeight: CGFloat
        let uppercase: Bool
        let opacity: Double

        // wordmark  17pt, tracking .34em, 60% opacity
        static let wordmark = TextStyle(face: .display, size: 17, weight: .regular,
                                        trackingEm: 0.34, lineHeight: 1.0, uppercase: false, opacity: 0.6)
        // h1 30, h2 21, h3 18  (no heading line-height in the sheet → no added spacing)
        static let h1 = TextStyle(face: .display, size: 30, weight: .regular,
                                  trackingEm: 0, lineHeight: 1.0, uppercase: false, opacity: 1)
        static let h2 = TextStyle(face: .display, size: 21, weight: .regular,
                                  trackingEm: 0, lineHeight: 1.0, uppercase: false, opacity: 1)
        static let h3 = TextStyle(face: .display, size: 18, weight: .regular,
                                  trackingEm: 0, lineHeight: 1.0, uppercase: false, opacity: 1)
        // body 15pt, line height 1.62
        static let body = TextStyle(face: .body, size: 15, weight: .regular,
                                    trackingEm: 0, lineHeight: 1.62, uppercase: false, opacity: 1)
        // label 9pt, uppercase, tracking .24em
        static let label = TextStyle(face: .labelSans, size: 9, weight: .medium,
                                     trackingEm: 0.24, lineHeight: 1.0, uppercase: true, opacity: 1)
        // button 9.5pt, uppercase, tracking .28em
        static let button = TextStyle(face: .labelSans, size: 9.5, weight: .medium,
                                      trackingEm: 0.28, lineHeight: 1.0, uppercase: true, opacity: 1)

        var font: Font {
            switch face {
            case .display:   return .custom(Flo.Family.display, size: size)
            case .body:      return .custom(Flo.Family.body, size: size)
            case .labelSans: return .system(size: size, weight: weight)
            }
        }
        var trackingPoints: CGFloat { size * trackingEm }
        var lineSpacingPoints: CGFloat { size * (lineHeight - 1) }
    }
}

// MARK: - Colour from hex
extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(.sRGB,
                  red: Double((hex >> 16) & 0xFF) / 255,
                  green: Double((hex >> 8) & 0xFF) / 255,
                  blue: Double(hex & 0xFF) / 255,
                  opacity: alpha)
    }
}

// MARK: - Applying a text style
extension View {
    /// Apply a Florence text style. Colour defaults to ink; the style's own
    /// opacity (e.g. the wordmark's 60%) is layered on top.
    func floText(_ style: Flo.TextStyle, colour: Color = Flo.Colour.ink) -> some View {
        self
            .font(style.font)
            .tracking(style.trackingPoints)
            .lineSpacing(style.lineSpacingPoints)
            .textCase(style.uppercase ? .uppercase : nil)
            .foregroundStyle(colour.opacity(style.opacity))
    }
}

// MARK: - The screen frame
extension View {
    /// Ground background + the standard frame padding, content pinned to top.
    func floScreen(alignment: Alignment = .top) -> some View {
        self
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: alignment)
            .padding(Flo.Frame.insets)
            .background(Flo.Colour.ground.ignoresSafeArea())
    }
}

// MARK: - Font registration
// Registers the bundled variable TTFs at launch, so the Info.plist UIAppFonts
// entries are optional. Call FloFonts.register() from your App's init().
enum FloFonts {
    static func register() {
        for name in ["PlayfairDisplay", "PlayfairDisplay-Italic", "Cormorant", "Cormorant-Italic"] {
            guard let url = Bundle.main.url(forResource: name, withExtension: "ttf") else { continue }
            CTFontManagerRegisterFontsForURL(url as CFURL, .process, nil)
        }
    }
}
