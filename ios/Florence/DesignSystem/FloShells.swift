import SwiftUI

// =====================================================================
// The two layout shells every screen is built inside.
//   AuthShell  — the centred wordmark at the top, content beneath.
//   InnerShell — a header bar: back arrow on the left, section name
//                centred in the wordmark style.
// Both use the standard frame padding from the token sheet.
// =====================================================================

/// The Florence wordmark, in the display face at wordmark size and 60% opacity.
struct Wordmark: View {
    var body: some View {
        Text("Florence")
            .floText(.wordmark)
            .frame(maxWidth: .infinity, alignment: .center)
    }
}

/// Auth screens: centred wordmark, then the screen's content below it.
struct AuthShell<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        VStack(spacing: 0) {
            Wordmark()
            content
        }
        .floScreen()
    }
}

/// Inner screens: a header bar with a back arrow on the left and the section
/// name centred in the wordmark style, then the screen's content below.
struct InnerShell<Content: View>: View {
    let title: String
    var onBack: (() -> Void)? = nil
    @ViewBuilder var content: Content

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                // Section name, centred, wordmark style.
                Text(title).floText(.wordmark)

                // Back arrow, left-aligned. Uses the inkSoft token (no invented opacity).
                HStack {
                    Button {
                        if let onBack { onBack() } else { dismiss() }
                    } label: {
                        Text("\u{2039}")   // ‹
                            .font(.custom(Flo.Family.display, size: 22))
                            .foregroundStyle(Flo.Colour.inkSoft)
                    }
                    .accessibilityLabel("Back")
                    Spacer()
                }
            }
            content
        }
        .floScreen()
    }
}
